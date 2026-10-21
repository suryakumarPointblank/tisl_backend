import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

// One-off content tweak per client request: the Peripheral (PER) and Visceral
// (VIS) cards under "Choose your therapy area" should list "Interventional
// Radiology" in their content topics line (therapy_areas.description). Both
// areas were split off the old IR area, so IR is the umbrella topic.
//
// Idempotent - descriptions already mentioning it are left alone.

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'tisl',
});

const TOPIC = 'Interventional Radiology';

async function main() {
  await AppDataSource.initialize();

  const rows: { id: string; code: string; description: string | null }[] = await AppDataSource.query(
    `SELECT id, code, description FROM therapy_areas WHERE code IN ('PER', 'VIS')`,
  );

  for (const row of rows) {
    const current = (row.description ?? '').trim();
    if (current.includes(TOPIC)) {
      console.log(`${row.code}: already includes "${TOPIC}", skipped`);
      continue;
    }
    const next = current ? `${TOPIC}. ${current}` : `${TOPIC}.`;
    await AppDataSource.query(`UPDATE therapy_areas SET description = $1 WHERE id = $2`, [next, row.id]);
    console.log(`${row.code}: "${current}" -> "${next}"`);
  }

  if (!rows.length) console.log('No PER/VIS therapy areas found - nothing to do');

  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
