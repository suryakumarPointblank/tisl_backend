import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
dotenv.config();

// Correction: the Journals sheet uses a red/green cell-fill color code on rows
// with a blank Retain/Modify/Remove text value — a signal missed on the first
// migration pass (which treated all blank RRM rows as "include"). Red-filled
// rows mean "remove", green means "migrate". All 71 red rows are IR.
// Soft-deleting (is_active = false) rather than hard-deleting, since it's the
// reversible interpretation of "removed" — content stays for audit/undo.

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

  const redRows: { row: number; title: string; ta: string }[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'journals-red-rows.json'), 'utf-8'),
  );

  let deactivated = 0;
  let notFound = 0;
  const log: any[] = [];

  for (const r of redRows) {
    const rows = await AppDataSource.query(
      `SELECT id, is_active FROM content_items WHERE title = $1`,
      [r.title],
    );
    if (!rows.length) {
      notFound++;
      log.push({ excel_row: r.row, title: r.title, status: 'NOT FOUND in DB' });
      continue;
    }
    const row = rows[0];
    if (row.is_active === false) {
      log.push({ excel_row: r.row, title: r.title, status: 'Already inactive' });
      continue;
    }
    await AppDataSource.query(`UPDATE content_items SET is_active = false WHERE id = $1`, [row.id]);
    deactivated++;
    log.push({ excel_row: r.row, title: r.title, status: 'Deactivated (isActive=false)' });
  }

  fs.writeFileSync(path.join(__dirname, 'journals-red-deactivation-log.json'), JSON.stringify(log, null, 2));
  console.log(`Deactivated: ${deactivated}, Not found: ${notFound}, Total red rows: ${redRows.length}`);

  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
