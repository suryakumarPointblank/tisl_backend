import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
dotenv.config();

// Backfill: after migrate-ir-content.ts created IR content items with fileUrl
// pointing at the original terumoindiaskilllab.com page, we cross-referenced the
// old prod MySQL DB (10.17.71.2:3309, terumoin_dev) to resolve the real
// YouTube/Vimeo/self-hosted-mp4 URL for 30 of the 39 video/webinar/colloquium
// items. This moves fileUrl to the resolved URL and keeps the original page
// link in contentData.originalSourceUrl, matching the pattern already used for
// IC's migrated content.

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

  const mapPath = path.join(__dirname, 'ar-title-to-resolved-url.json');
  const titleToUrl: Record<string, string> = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));

  let updated = 0;
  let notFound = 0;

  for (const [title, resolvedUrl] of Object.entries(titleToUrl)) {
    const rows = await AppDataSource.query(
      `SELECT id, file_url, content_data FROM content_items WHERE title = $1`,
      [title],
    );
    if (!rows.length) {
      console.log(`NOT FOUND in DB: ${title}`);
      notFound++;
      continue;
    }
    for (const row of rows) {
      const originalUrl = row.file_url;
      const contentData = { ...(row.content_data || {}), originalSourceUrl: originalUrl };
      await AppDataSource.query(
        `UPDATE content_items SET file_url = $1, content_data = $2 WHERE id = $3`,
        [resolvedUrl, JSON.stringify(contentData), row.id],
      );
      updated++;
      console.log(`Updated: ${title} -> ${resolvedUrl}`);
    }
  }

  console.log(`Updated: ${updated}, Not found: ${notFound}`);
  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
