import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
dotenv.config();

// One-off migration: bring Aortic Repair (AR) content items from the
// "TISL_Content List_Taxonomy and Tagging.xlsx" master list into the DB.
// Same approach as migrate-cv-content.ts.

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
  PRESENTATION: 'SLIDE_DECK',
  PUBLICATION: 'ARTICLE_SUMMARY',
};

function resolveTopicName(subtopic: string | null): string {
  return subtopic || 'General';
}

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'tisl',
});

async function ensureGeneralTopic(subSectionId: string, subSectionName: string) {
  const existing = await AppDataSource.query(
    `SELECT id FROM topics WHERE sub_section_id = $1 AND name = 'General'`,
    [subSectionId],
  );
  if (existing.length) return existing[0].id;
  const result = await AppDataSource.query(
    `INSERT INTO topics (sub_section_id, name, slug, order_index, is_active)
     VALUES ($1, 'General', 'general', 99, true) RETURNING id`,
    [subSectionId],
  );
  console.log(`Created fallback "General" topic under "${subSectionName}"`);
  return result[0].id;
}

async function main() {
  await AppDataSource.initialize();

  const ta = await AppDataSource.query(`SELECT id FROM therapy_areas WHERE code = 'AR'`);
  if (!ta.length) throw new Error('AR therapy area not found');
  const taId = ta[0].id;

  const subSections = await AppDataSource.query(
    `SELECT id, name FROM sub_sections WHERE therapy_area_id = $1`,
    [taId],
  );
  const subSectionByName: Record<string, string> = {};
  for (const s of subSections) subSectionByName[s.name] = s.id;

  // Sheet topic label -> DB sub_section name (identical here, listed for clarity)
  const TOPIC_TO_SUBSECTION: Record<string, string> = {
    'Aortic Disease Fundamentals': 'Aortic Disease Fundamentals',
    'Aortic Pathologies': 'Aortic Pathologies',
    'Endovascular Aortic Repair': 'Endovascular Aortic Repair',
    'Hybrid & Frozen Elephant Trunk (FET) Procedures': 'Hybrid & Frozen Elephant Trunk (FET) Procedures',
  };

  const generalTopicIds: Record<string, string> = {};
  for (const subSectionName of Object.values(TOPIC_TO_SUBSECTION)) {
    const subSectionId = subSectionByName[subSectionName];
    if (!subSectionId) throw new Error(`Sub-section not found: ${subSectionName}`);
    generalTopicIds[subSectionName] = await ensureGeneralTopic(subSectionId, subSectionName);
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

  const rowsPath = path.join(__dirname, 'ar-final.json');
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
    const topicName = resolveTopicName(row.subtopic);
    const topicId = await findTopicId(subSectionName, topicName);

    const contentType = CONTENT_TYPE_MAP[row.contentTypeRaw];
    if (!contentType) throw new Error(`Unmapped content type: ${row.contentTypeRaw}`);

    const contentData: Record<string, unknown> = {
      level: row.level,
      access: row.access,
      audience: row.audience,
      sourceSheet: `TISL Content List - ${row.sheet}`,
    };
    if (contentType === 'ARTICLE_SUMMARY' && row.url) {
      contentData.articleUrl = row.url;
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
    statusLog.push({
      excel_row: row.excel_row,
      sheet: row.sheet,
      title: row.title,
      status: 'Migrated',
      notes: row.url
        ? 'Linked to original terumoindiaskilllab.com URL (fileUrl resolution pass not yet run for CV).'
        : 'No source URL in sheet (presentation slide deck) — created without fileUrl.',
    });
  }

  fs.writeFileSync(
    path.join(__dirname, 'ar-migration-status.json'),
    JSON.stringify(statusLog, null, 2),
  );

  console.log(`Created: ${created}, Skipped: ${skipped}`);
  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
