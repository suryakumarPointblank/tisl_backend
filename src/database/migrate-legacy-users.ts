import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
dotenv.config();

// One-off import of the old terumoindiaskilllab.com (Laravel) user base,
// client-approved list (red-highlighted rows and inactive accounts excluded
// upstream when src/database/data/legacy-tisl-users.json was generated).
// Password hashes are carried over as-is from the old site (Laravel bcrypt
// $2y$ hashes, normalized to $2b$ for node's bcrypt - verified compatible),
// so migrated users keep logging in with their existing password. city/state/
// speciality fall back to 'Not Specified' where the old record had none.
interface LegacyUser {
  firstName: string;
  lastName: string | null;
  email: string;
  mobile: null;
  passwordHash: string | null;
  hospital: string | null;
  city: string;
  state: string;
  speciality: string;
  role: string;
  status: string;
  lmsAccess: string | null;
}

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'tisl',
});

async function main() {
  await AppDataSource.initialize();
  const dataPath = path.join(__dirname, 'data', 'legacy-tisl-users.json');
  const users = JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as LegacyUser[];

  let inserted = 0;
  let skippedExisting = 0;

  for (const u of users) {
    const existing = await AppDataSource.query(
      'SELECT id FROM users WHERE email = $1',
      [u.email],
    );
    if (existing.length > 0) {
      skippedExisting++;
      continue;
    }

    await AppDataSource.query(
      `INSERT INTO users
        (first_name, last_name, email, mobile, password_hash, hospital,
         city, state, speciality, role, status, lms_access, provider,
         email_verified, mobile_verified, consent_marketing, consent_terumo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'local',true,false,false,false)`,
      [
        u.firstName,
        u.lastName,
        u.email,
        u.mobile,
        u.passwordHash,
        u.hospital,
        u.city,
        u.state,
        u.speciality,
        u.role,
        u.status,
        u.lmsAccess,
      ],
    );
    inserted++;
  }

  console.log(`Inserted: ${inserted}`);
  console.log(`Skipped (email already exists): ${skippedExisting}`);
  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
