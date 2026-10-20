import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';
import { Logger } from '../../common/utils/logger';

export interface GainLmsAccess {
  vista: ('IC' | 'IR')[];
  gain: ('Radial Access' | 'NANTO Model')[];
}

const EMPTY_ACCESS: GainLmsAccess = { vista: [], gain: [] };

// gain.terumoindiaskilllab.com is a separate WordPress/LearnDash site with its
// own MySQL database - course ids 30114 (Interventional Cardiology) and 30734
// (Interventional Radiology) are the two courses reachable via the VISTA
// button; 26791 (Radial Access) and 31050 (NANTO Model) are reachable via the
// external "Gain" request-access flow. Button visibility used to be decided
// by a static email whitelist copied from the old site, which drifts from
// reality whenever someone's actual course enrollment doesn't match - this
// queries gain's live enrollment data instead.
@Injectable()
export class GainLmsService {
  private readonly logger = new Logger('GainLmsService');
  private pool: mysql.Pool | null = null;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('GAIN_DB_HOST');
    if (!host) {
      this.logger.warn('GAIN_DB_HOST not set - gain LMS access lookups disabled');
      return;
    }
    this.pool = mysql.createPool({
      host,
      port: this.config.get<number>('GAIN_DB_PORT') || 3306,
      user: this.config.get<string>('GAIN_DB_USER'),
      password: this.config.get<string>('GAIN_DB_PASSWORD'),
      database: this.config.get<string>('GAIN_DB_NAME'),
      connectionLimit: 3,
      connectTimeout: 3000,
    });
  }

  async getAccess(email: string): Promise<GainLmsAccess> {
    if (!this.pool || !email) return EMPTY_ACCESS;
    try {
      const [rows] = await this.pool.query<mysql.RowDataPacket[]>(
        `SELECT
           MAX(CASE WHEN m.meta_key = 'course_30114_access_from' THEN 1 ELSE 0 END) AS ic,
           MAX(CASE WHEN m.meta_key = 'course_30734_access_from' THEN 1 ELSE 0 END) AS ir,
           MAX(CASE WHEN m.meta_key = 'course_26791_access_from' THEN 1 ELSE 0 END) AS radial,
           MAX(CASE WHEN m.meta_key = 'course_31050_access_from' THEN 1 ELSE 0 END) AS nanto
         FROM wp_users u
         JOIN wp_usermeta m ON u.ID = m.user_id
         WHERE LOWER(u.user_email) = LOWER(?)
           AND m.meta_key IN ('course_30114_access_from','course_30734_access_from','course_26791_access_from','course_31050_access_from')`,
        [email],
      );
      const row = rows[0];
      if (!row) return EMPTY_ACCESS;
      const vista: GainLmsAccess['vista'] = [];
      if (row.ic) vista.push('IC');
      if (row.ir) vista.push('IR');
      const gain: GainLmsAccess['gain'] = [];
      if (row.radial) gain.push('Radial Access');
      if (row.nanto) gain.push('NANTO Model');
      return { vista, gain };
    } catch (err) {
      this.logger.warn('Gain LMS lookup failed, treating as no access', { email, error: err.message });
      return EMPTY_ACCESS;
    }
  }
}
