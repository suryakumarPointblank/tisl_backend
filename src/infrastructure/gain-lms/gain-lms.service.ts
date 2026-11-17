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
      // course_X_access_from is only written the first time a user actually
      // opens that course, so a newly-enrolled user who hasn't clicked in yet
      // has none of these rows even though they already have access - the
      // WordPress role granted at enrollment time (wp_capabilities) is the
      // earlier, authoritative signal, so either one counts as having access.
      const [rows] = await this.pool.query<mysql.RowDataPacket[]>(
        `SELECT
           MAX(CASE WHEN m.meta_key = 'course_30114_access_from' THEN 1 ELSE 0 END) AS ic_course,
           MAX(CASE WHEN m.meta_key = 'course_30734_access_from' THEN 1 ELSE 0 END) AS ir_course,
           MAX(CASE WHEN m.meta_key = 'course_26791_access_from' THEN 1 ELSE 0 END) AS radial,
           MAX(CASE WHEN m.meta_key = 'course_31050_access_from' THEN 1 ELSE 0 END) AS nanto_course,
           MAX(CASE WHEN m.meta_key = 'wp_capabilities' AND (m.meta_value LIKE '%"vista_ic";b:1;%' OR m.meta_value LIKE '%"vista_ic";i:1;%') THEN 1 ELSE 0 END) AS ic_role,
           MAX(CASE WHEN m.meta_key = 'wp_capabilities' AND (m.meta_value LIKE '%"vista_ir";b:1;%' OR m.meta_value LIKE '%"vista_ir";i:1;%') THEN 1 ELSE 0 END) AS ir_role,
           MAX(CASE WHEN m.meta_key = 'wp_capabilities' AND (m.meta_value LIKE '%"nantouser";b:1;%' OR m.meta_value LIKE '%"nantouser";i:1;%') THEN 1 ELSE 0 END) AS nanto_role
         FROM wp_users u
         JOIN wp_usermeta m ON u.ID = m.user_id
         WHERE LOWER(u.user_email) = LOWER(?)
           AND m.meta_key IN ('course_30114_access_from','course_30734_access_from','course_26791_access_from','course_31050_access_from','wp_capabilities')`,
        [email],
      );
      const row = rows[0];
      if (!row) return EMPTY_ACCESS;
      const vista: GainLmsAccess['vista'] = [];
      if (row.ic_course || row.ic_role) vista.push('IC');
      if (row.ir_course || row.ir_role) vista.push('IR');
      const gain: GainLmsAccess['gain'] = [];
      if (row.radial) gain.push('Radial Access');
      if (row.nanto_course || row.nanto_role) gain.push('NANTO Model');
      return { vista, gain };
    } catch (err) {
      this.logger.warn('Gain LMS lookup failed, treating as no access', { email, error: err.message });
      return EMPTY_ACCESS;
    }
  }

  // Mirrors the old Laravel site's registration flow (LoginController.php),
  // which called this same endpoint on every new TISL signup so every user
  // gets a subscriber-level gain account automatically. Password convention
  // matches what the VISTA/Gain SSO login forms already assume: lastName+"@123".
  // Best-effort and never throws - a gain outage shouldn't block TISL
  // registration, and gain's own endpoint already no-ops on a duplicate email.
  async registerAccount(firstName: string, lastName: string, email: string): Promise<void> {
    try {
      const res = await fetch('https://gain.terumoindiaskilllab.com/api/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email }),
        signal: AbortSignal.timeout(5000),
      });
      const data = await res.json().catch(() => null);
      this.logger.log('Gain account registration attempted', { email, status: data?.status, message: data?.message });
    } catch (err) {
      this.logger.warn('Gain account registration failed, continuing without it', { email, error: err.message });
    }
  }
}
