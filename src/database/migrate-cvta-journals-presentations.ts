import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
dotenv.config();

// One-off migration: bring CV + AR ("TA" in the sheet) rows from the newly
// re-tagged Journals/Presentations sheets
// (TISL_Content_List_Taxonomy_and_Tagging_Journals and Presentations_cv_ta.xlsx)
// into the DB. Mirrors migrate-journals-presentations.ts (the IC/IR pass).
//
// IMPORTANT DEVIATION from the IC/IR pass: for IC/IR, the sheet's "Sub-topic"
// values matched real, curated Topic entities already in the DB hierarchy
// (e.g. "Liver Cancer", "PAD"). For CV/AR, the "Sub-topic" column here is a
// free-text micro-tag unique to almost every row (e.g. "AKI & CPB", "Bentall",
// "Marfan Syndrome") — there is no matching Topic entity for ~130 of these,
// only a generic "General" topic per sub-section. Rather than explode the
// navigation hierarchy with ~130 one-article "topics", every row is filed
// under its sub-section's "General" topic, and the sheet's free-text
// sub-topic is preserved as contentData.tag for reference/searchability.

type JournalRow = {
  excel_row: number;
  title: string;
  ta: 'CV' | 'TA';
  topic: string;
  subtopic: string | null;
  access: string | null;
  faculty: string | null;
  pdf_url: string | null;
  image_url: string | null;
  action: 'include' | 'update' | 'exclude';
  reason: string | null;
};

type PresentationRow = {
  excel_row: number;
  title: string;
  ta: 'CV' | 'TA';
  topic: string;
  subtopic: string | null;
  access: string | null;
  faculty: string | null;
  pdf_url: string | null;
  action: 'include' | 'update' | 'exclude';
  reason: string | null;
};

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'tisl',
});

// Sheet's "Topic" label -> actual DB sub_section name (special-hyphen mismatch
// for CV's "Off‑Pump" and the "TA" therapy-area code -> AR mapping happen below)
const SUBSECTION_ALIAS: Record<string, string> = {
  'CV::Beating Heart & Off‑Pump Cardiac Surgery': 'Beating Heart & Off-Pump Cardiac Surgery',
};
const SHEET_TA_TO_CODE: Record<string, string> = { CV: 'CV', TA: 'AR' };

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

  const tas = await AppDataSource.query(`SELECT id, code FROM therapy_areas WHERE code IN ('CV','AR')`);
  const taIdByCode: Record<string, string> = {};
  for (const t of tas) taIdByCode[t.code] = t.id;

  const subSections = await AppDataSource.query(
    `SELECT id, name, therapy_area_id FROM sub_sections WHERE therapy_area_id IN ($1, $2)`,
    [taIdByCode.CV, taIdByCode.AR],
  );
  const subSectionKey: Record<string, string> = {};
  for (const s of subSections) {
    const taCode = s.therapy_area_id === taIdByCode.CV ? 'CV' : 'AR';
    subSectionKey[`${taCode}::${s.name}`] = s.id;
  }

  const generalTopicCache: Record<string, string> = {};
  async function findGeneralTopicId(sheetTa: 'CV' | 'TA', sheetSubSectionName: string): Promise<string> {
    const taCode = SHEET_TA_TO_CODE[sheetTa];
    const subSectionName = SUBSECTION_ALIAS[`${sheetTa}::${sheetSubSectionName}`] || sheetSubSectionName;
    const cacheKey = `${taCode}::${subSectionName}`;
    if (generalTopicCache[cacheKey]) return generalTopicCache[cacheKey];
    const subSectionId = subSectionKey[cacheKey];
    if (!subSectionId) throw new Error(`Sub-section not found: ${cacheKey}`);
    const id = await ensureGeneralTopic(subSectionId, cacheKey);
    generalTopicCache[cacheKey] = id;
    return id;
  }

  // ---------- Presentations: update-only (all 36 non-excluded titles already exist) ----------
  const presentations: PresentationRow[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'presentations-cvta-final.json'), 'utf-8'),
  );
  let presUpdated = 0;
  let presUnchanged = 0;
  let presNotFound = 0;
  let presSkipped = 0;
  const presStatus: any[] = [];
  for (const p of presentations) {
    if (p.action === 'exclude') {
      presSkipped++;
      presStatus.push({ excel_row: p.excel_row, title: p.title, status: 'Skipped', notes: p.reason });
      continue;
    }
    const rows = await AppDataSource.query(`SELECT id, file_url, content_data FROM content_items WHERE title = $1`, [p.title]);
    if (!rows.length) {
      presNotFound++;
      presStatus.push({ excel_row: p.excel_row, title: p.title, status: 'NOT FOUND in DB (unexpected)' });
      continue;
    }
    const row = rows[0];
    if (row.file_url === p.pdf_url) {
      presUnchanged++;
      presStatus.push({ excel_row: p.excel_row, title: p.title, status: 'Already up to date' });
      continue;
    }
    const contentData = { ...(row.content_data || {}), format: 'PDF' };
    await AppDataSource.query(`UPDATE content_items SET file_url = $1, content_data = $2 WHERE id = $3`, [
      p.pdf_url,
      JSON.stringify(contentData),
      row.id,
    ]);
    presUpdated++;
    presStatus.push({ excel_row: p.excel_row, title: p.title, status: `Updated fileUrl -> ${p.pdf_url}` });
  }
  console.log(`Presentations: updated=${presUpdated}, unchanged=${presUnchanged}, notFound=${presNotFound}, skipped=${presSkipped}`);

  // ---------- Journals: create new ----------
  const journals: JournalRow[] = JSON.parse(fs.readFileSync(path.join(__dirname, 'journals-cvta-final.json'), 'utf-8'));
  let journalCreated = 0;
  let journalSkipped = 0;
  let journalUpdated = 0;
  const journalStatus: any[] = [];

  for (const j of journals) {
    if (j.action === 'exclude') {
      journalSkipped++;
      journalStatus.push({ excel_row: j.excel_row, title: j.title, status: 'Skipped', notes: j.reason });
      continue;
    }

    const topicId = await findGeneralTopicId(j.ta, j.topic);

    const contentData: Record<string, unknown> = {
      access: j.access,
      sourceSheet: 'Journals (Journals and Presentations tagging, CV/AR pass)',
      articleUrl: j.pdf_url,
    };
    if (j.image_url) contentData.imageUrl = j.image_url;
    if (j.subtopic) contentData.tag = j.subtopic;

    if (j.action === 'update') {
      const existingRows = await AppDataSource.query(`SELECT id, file_url, content_data FROM content_items WHERE title = $1`, [j.title]);
      const row = existingRows[0];
      const merged = { ...(row.content_data || {}), ...contentData };
      await AppDataSource.query(`UPDATE content_items SET file_url = $1, content_data = $2 WHERE id = $3`, [
        j.pdf_url,
        JSON.stringify(merged),
        row.id,
      ]);
      journalUpdated++;
      journalStatus.push({ excel_row: j.excel_row, title: j.title, status: `Updated existing item -> ${j.pdf_url}` });
      continue;
    }

    const existingSameTopic = await AppDataSource.query(
      `SELECT id FROM content_items WHERE title = $1 AND topic_id = $2`,
      [j.title, topicId],
    );
    if (existingSameTopic.length) {
      journalSkipped++;
      journalStatus.push({ excel_row: j.excel_row, title: j.title, status: 'Skipped (duplicate within this run)' });
      continue;
    }

    await AppDataSource.query(
      `INSERT INTO content_items (topic_id, content_type, title, file_url, content_data, is_active)
       VALUES ($1, 'ARTICLE_SUMMARY', $2, $3, $4, true)`,
      [topicId, j.title, j.pdf_url, JSON.stringify(contentData)],
    );
    journalCreated++;
    journalStatus.push({ excel_row: j.excel_row, title: j.title, status: 'Migrated (new)' });
  }
  console.log(`Journals: created=${journalCreated}, updated=${journalUpdated}, skipped=${journalSkipped}`);

  fs.writeFileSync(path.join(__dirname, 'journals-cvta-migration-status.json'), JSON.stringify(journalStatus, null, 2));
  fs.writeFileSync(path.join(__dirname, 'presentations-cvta-migration-status.json'), JSON.stringify(presStatus, null, 2));

  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
