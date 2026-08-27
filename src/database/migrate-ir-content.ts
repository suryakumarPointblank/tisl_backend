import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
dotenv.config();

// One-off migration: bring Interventional Radiology (IR) content items from the
// "TISL_Content List_Taxonomy and Tagging.xlsx" master list into the DB.
// Source rows + include/exclude decisions were pre-extracted into ir-final.json
// (see conversation notes / excel "Migration Status"/"Migration Notes" columns
// for why each row was included, excluded, or flagged with a caveat).

type Row = {
  sheet: string;
  excel_row: number;
  contentTypeRaw: string;
  title: string;
  url: string | null;
  topic: string | null;
  subtopic: string | null;
  level: string | null;
  audience: string | null;
  access: string | null;
  action: 'include' | 'exclude';
  note: string | null;
};

const CONTENT_TYPE_MAP: Record<string, string> = {
  VIDEO: 'VIDEO',
  WEBINAR: 'RECORDED_WEBINAR',
  COLLOQUIUM: 'RECORDED_WEBINAR',
  PUBLICATION: 'ARTICLE_SUMMARY',
  BLOG: 'ARTICLE_SUMMARY',
  CAROUSEL: 'INFOGRAPHIC',
};

// (subSectionName, topicName-or-null-for-fallback) -> topic name to look up.
// Sub-topic text in the sheet doesn't always match the DB topic name exactly
// (e.g. "Chronic Total Occlusions (CTO)" vs "CTO"), so IR's subtopics are simple
// enough to match directly; null subtopic falls back to a "General" topic.
function resolveTopicName(subSection: string, subtopic: string | null): string {
  if (subtopic) return subtopic;
  return 'General';
}

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'tisl',
});

async function ensureGeneralTopic(subSectionId: string, subSectionName: string, orderIndex: number) {
  const existing = await AppDataSource.query(
    `SELECT id FROM topics WHERE sub_section_id = $1 AND name = 'General'`,
    [subSectionId],
  );
  if (existing.length) return existing[0].id;
  const slug = 'general';
  const result = await AppDataSource.query(
    `INSERT INTO topics (sub_section_id, name, slug, order_index, is_active)
     VALUES ($1, 'General', $2, $3, true) RETURNING id`,
    [subSectionId, slug, orderIndex],
  );
  console.log(`Created fallback "General" topic under "${subSectionName}"`);
  return result[0].id;
}

async function main() {
  await AppDataSource.initialize();

  const ta = await AppDataSource.query(`SELECT id FROM therapy_areas WHERE code = 'IR'`);
  if (!ta.length) throw new Error('IR therapy area not found');
  const taId = ta[0].id;

  const subSections = await AppDataSource.query(
    `SELECT id, name FROM sub_sections WHERE therapy_area_id = $1`,
    [taId],
  );
  const subSectionByName: Record<string, string> = {};
  for (const s of subSections) subSectionByName[s.name] = s.id;

  // Normalize the sheet's slightly different subsection label ("Non- oncological…")
  const TOPIC_TO_SUBSECTION: Record<string, string> = {
    Oncology: 'Oncology',
    'Non- oncological Embolization Therapies': 'Non-oncological Embolization Therapies',
    'Vascular Disease': 'Vascular Disease',
  };

  // Ensure "General" fallback topics exist where the sheet has null sub-topics.
  const generalTopicIds: Record<string, string> = {};
  for (const [, subSectionName] of Object.entries(TOPIC_TO_SUBSECTION)) {
    const subSectionId = subSectionByName[subSectionName];
    if (!subSectionId) throw new Error(`Sub-section not found: ${subSectionName}`);
    generalTopicIds[subSectionName] = await ensureGeneralTopic(subSectionId, subSectionName, 99);
  }

  const topicCache: Record<string, string> = {};
  async function findTopicId(subSectionName: string, topicName: string): Promise<string> {
    const key = `${subSectionName}::${topicName}`;
    if (topicCache[key]) return topicCache[key];
    const subSectionId = subSectionByName[subSectionName];
    const rows = await AppDataSource.query(
      `SELECT id FROM topics WHERE sub_section_id = $1 AND name = $2`,
      [subSectionId, topicName],
    );
    if (!rows.length) {
      throw new Error(`Topic "${topicName}" not found under sub-section "${subSectionName}"`);
    }
    topicCache[key] = rows[0].id;
    return rows[0].id;
  }

  const rowsPath = path.join(__dirname, 'ir-final.json');
  const rows: Row[] = JSON.parse(fs.readFileSync(rowsPath, 'utf-8'));

  let created = 0;
  let skipped = 0;
  const statusLog: { excel_row: number; sheet: string; title: string; status: string; notes: string }[] = [];

  for (const row of rows) {
    if (row.action === 'exclude') {
      skipped++;
      statusLog.push({ excel_row: row.excel_row, sheet: row.sheet, title: row.title, status: 'Skipped', notes: row.note || '' });
      continue;
    }

    const subSectionName = TOPIC_TO_SUBSECTION[row.topic || ''];
    if (!subSectionName) {
      throw new Error(`Unmapped topic/sub-section for row: ${row.title} (topic="${row.topic}")`);
    }
    const topicName = resolveTopicName(subSectionName, row.subtopic);
    const topicId = await findTopicId(subSectionName, topicName);

    const contentType = CONTENT_TYPE_MAP[row.contentTypeRaw];
    if (!contentType) throw new Error(`Unmapped content type: ${row.contentTypeRaw}`);

    // Existing IC data resolves VIDEO/RECORDED_WEBINAR fileUrl to the real player
    // URL (e.g. vimeo.com/...) with the terumoindiaskilllab.com page kept in
    // contentData.originalSourceUrl. That resolution requires a JS-rendered browser
    // (the site is client-rendered; static fetch returns no player URL), which is
    // out of scope here — so fileUrl falls back to the original page link directly.
    const contentData: Record<string, unknown> = {
      level: row.level,
      access: row.access,
      audience: row.audience,
      sourceSheet: `TISL Content List - ${row.sheet}`,
    };
    if (contentType === 'ARTICLE_SUMMARY') {
      contentData.articleUrl = row.url;
    }
    if (contentType === 'INFOGRAPHIC' && row.contentTypeRaw === 'CAROUSEL') {
      contentData.format = 'PDF';
    }
    if (row.note) contentData.migrationNote = row.note;

    const existing = await AppDataSource.query(
      `SELECT id FROM content_items WHERE title = $1 AND topic_id = $2`,
      [row.title, topicId],
    );
    if (existing.length) {
      skipped++;
      statusLog.push({ excel_row: row.excel_row, sheet: row.sheet, title: row.title, status: 'Skipped (already exists)', notes: row.note || '' });
      continue;
    }

    await AppDataSource.query(
      `INSERT INTO content_items (topic_id, content_type, title, file_url, content_data, is_active)
       VALUES ($1, $2, $3, $4, $5, true)`,
      [topicId, contentType, row.title, row.url, JSON.stringify(contentData)],
    );
    created++;
    const noteSuffix = row.note ? ` [caveat: ${row.note}]` : '';
    statusLog.push({
      excel_row: row.excel_row,
      sheet: row.sheet,
      title: row.title,
      status: 'Migrated',
      notes: `Linked to original terumoindiaskilllab.com URL (could not resolve to a direct media/Vimeo URL statically — page is client-rendered).${noteSuffix}`,
    });
  }

  fs.writeFileSync(
    path.join(__dirname, 'ir-migration-status.json'),
    JSON.stringify(statusLog, null, 2),
  );

  console.log(`Created: ${created}, Skipped: ${skipped}`);
  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
