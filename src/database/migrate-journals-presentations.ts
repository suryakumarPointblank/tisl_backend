import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
dotenv.config();

// One-off migration: bring the newly-tagged "Journals" and "Presentations" sheets
// (TISL_Content_List_Taxonomy_and_Tagging_Journals and Presentations.xlsx) into the
// DB, for IC + IR only (CV/AR/Medication Management out of scope per instruction).
//
// This sheet is far richer than the old thin "Publication"/"Presentatio" sheets used
// for the first pass: it carries real hosted PDF/image URLs (GCS `pebbles2-terumo-
// journals`/`pebbles2-terumo-presentations` buckets) as cell hyperlinks, not just a
// link to the old terumoindiaskilllab.com page.
//
// Matching by title against existing content_items:
//  - Presentations: all 54 titles already exist (from the earlier Presentatio-sheet
//    migration) — this pass just upgrades fileUrl where it's better/different.
//  - Journals: only 7 of 712 titles match something already in the DB (the other 35
//    of the old 42 Publication-sourced IC/IR items have no match here at all — left
//    untouched, still linking to the old page, flagged in the excel for review).
//    The 7 matches get upgraded to the real PDF; the remaining ~705 are net-new.

type JournalRow = {
  excel_row: number;
  title: string;
  ta: 'IC' | 'IR';
  topic: string;
  subtopic: string | null;
  access: string | null;
  faculty: string | null;
  pdf_url: string | null;
  image_url: string | null;
};

type PresentationRow = {
  excel_row: number;
  title: string;
  ta: 'IC';
  topic: string;
  subtopic: string | null;
  access: string | null;
  faculty: string | null;
  pdf_url: string | null;
};

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

  const tas = await AppDataSource.query(`SELECT id, code FROM therapy_areas WHERE code IN ('IC','IR')`);
  const taIdByCode: Record<string, string> = {};
  for (const t of tas) taIdByCode[t.code] = t.id;

  const subSections = await AppDataSource.query(
    `SELECT id, name, therapy_area_id FROM sub_sections WHERE therapy_area_id IN ($1, $2)`,
    [taIdByCode.IC, taIdByCode.IR],
  );
  // subsection lookup keyed by (taCode, subSectionName)
  const subSectionKey: Record<string, string> = {};
  for (const s of subSections) {
    const taCode = s.therapy_area_id === taIdByCode.IC ? 'IC' : 'IR';
    subSectionKey[`${taCode}::${s.name}`] = s.id;
  }

  // Sheet's "Topic" label -> actual DB sub_section name (they drifted apart over time)
  const SUBSECTION_ALIAS: Record<string, string> = {
    'IC::Complex PCI (cPCI) Anatomy & Technique': 'Complex PCI Anatomy & Technique',
    'IC::Advanced Technologies & Optimization': 'Intravascular Imaging & Other Devices',
    'IR::Non- oncological Embolization Therapies': 'Non-oncological Embolization Therapies',
  };

  const topicCache: Record<string, string> = {};
  async function findTopicId(taCode: string, sheetSubSectionName: string, topicName: string | null): Promise<string> {
    const subSectionName = SUBSECTION_ALIAS[`${taCode}::${sheetSubSectionName}`] || sheetSubSectionName;
    const subSectionId = subSectionKey[`${taCode}::${subSectionName}`];
    if (!subSectionId) throw new Error(`Sub-section not found: ${taCode} / ${subSectionName}`);

    if (topicName) {
      const key = `${taCode}::${subSectionName}::${topicName}`;
      if (topicCache[key]) return topicCache[key];
      const rows = await AppDataSource.query(
        `SELECT id FROM topics WHERE sub_section_id = $1 AND name = $2`,
        [subSectionId, topicName],
      );
      if (rows.length) {
        topicCache[key] = rows[0].id;
        return rows[0].id;
      }
      // fall through to General if the named topic doesn't exist (e.g. stray "Others" subtopic value)
    }
    const generalKey = `${taCode}::${subSectionName}::General`;
    if (topicCache[generalKey]) return topicCache[generalKey];
    const id = await ensureGeneralTopic(subSectionId, `${taCode} / ${subSectionName}`);
    topicCache[generalKey] = id;
    return id;
  }

  // ---------- Presentations: update-only (all 54 titles already exist) ----------
  const presentations: PresentationRow[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'presentations-final.json'), 'utf-8'),
  );
  let presUpdated = 0;
  let presUnchanged = 0;
  let presNotFound = 0;
  const presStatus: any[] = [];
  for (const p of presentations) {
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
  console.log(`Presentations: updated=${presUpdated}, unchanged=${presUnchanged}, notFound=${presNotFound}`);

  // ---------- Journals: create new, upgrade the 7 title-matches ----------
  const journals: JournalRow[] = JSON.parse(fs.readFileSync(path.join(__dirname, 'journals-final.json'), 'utf-8'));
  let journalCreated = 0;
  let journalUpdated = 0;
  let journalSkippedDup = 0;
  const journalStatus: any[] = [];

  for (const j of journals) {
    const topicId = await findTopicId(j.ta, j.topic, j.subtopic);

    const contentData: Record<string, unknown> = {
      access: j.access,
      sourceSheet: 'Journals (Journals and Presentations tagging)',
      articleUrl: j.pdf_url,
    };
    if (j.image_url) contentData.imageUrl = j.image_url;

    const existingByTitle = await AppDataSource.query(`SELECT id, file_url, content_data FROM content_items WHERE title = $1`, [j.title]);
    if (existingByTitle.length) {
      const row = existingByTitle[0];
      const merged = { ...(row.content_data || {}), ...contentData };
      await AppDataSource.query(`UPDATE content_items SET file_url = $1, content_data = $2 WHERE id = $3`, [
        j.pdf_url,
        JSON.stringify(merged),
        row.id,
      ]);
      journalUpdated++;
      journalStatus.push({ excel_row: j.excel_row, title: j.title, status: `Updated existing item -> real PDF ${j.pdf_url}` });
      continue;
    }

    const existingSameTopic = await AppDataSource.query(
      `SELECT id FROM content_items WHERE title = $1 AND topic_id = $2`,
      [j.title, topicId],
    );
    if (existingSameTopic.length) {
      journalSkippedDup++;
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
  console.log(`Journals: created=${journalCreated}, updated=${journalUpdated}, skippedDup=${journalSkippedDup}`);

  fs.writeFileSync(path.join(__dirname, 'journals-migration-status.json'), JSON.stringify(journalStatus, null, 2));
  fs.writeFileSync(path.join(__dirname, 'presentations-migration-status.json'), JSON.stringify(presStatus, null, 2));

  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
