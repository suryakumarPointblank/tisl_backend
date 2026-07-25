import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

// One-off backfill for the ContentType rename (see content-item.entity.ts).
// contentType is a plain varchar with no DB-level enum constraint, so existing
// rows created under the old taxonomy need to be remapped to the new values.
const RENAME_MAP: Record<string, string> = {
  WEBINAR_VIDEO: 'RECORDED_WEBINAR',
  PROCEDURE_DEMO: 'VIDEO',
  CASE_STUDY: 'CASE_REPORT',
  SLIDE_PRESENTATION: 'SLIDE_DECK',
  SLIDESHOW: 'SLIDE_DECK',
  SHORT_VIDEO: 'IN_SHORT',
  // INFOGRAPHIC, EXPERT_OPINION, ARTICLE_SUMMARY, PODCAST, LATEST_UPDATE are unchanged.
};

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
  for (const [oldValue, newValue] of Object.entries(RENAME_MAP)) {
    const result = await AppDataSource.query(
      'UPDATE content_items SET content_type = $1 WHERE content_type = $2',
      [newValue, oldValue],
    );
    console.log(`${oldValue} -> ${newValue}: ${result[1]} row(s) updated`);
  }
  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
