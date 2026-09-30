import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

// One-off restructuring per client request (mail: "break down IR into 2
// separate sections... revised architecture: IC, Peripheral, Visceral,
// Cardiovascular, Aortic and Medication Management") + attached sitemap
// (New site map_IR.pptx).
//
// Mechanics: rename the existing IR therapy_area row in place to become
// "Visceral" (keeps its Oncology + Embolotherapy sub-sections, so their
// content_items and IDs never move). Create a new "Peripheral" therapy_area
// and re-parent the existing "Vascular Disease" sub-section onto it.
//
// Content-mapping decision (confirmed with the client-side requester): the
// sitemap's finer topic lists (TACE/B-TACE/DEB-TACE/Access under oncology;
// Access/PAD/CLTI/Vascular Closure under Peripheral) don't have a 1:1 home
// for two existing buckets — "Interventional Oncology Therapies" (7 items)
// and Vascular Disease's "General" (31 items). Rather than hand-classify
// those 38 items, both get folded into a "General" topic (Oncology's is
// literally renamed from "Interventional Oncology Therapies" -> "General",
// re-using the same topic row so the 7 items never move rows; Vascular
// Disease's existing General topic just carries over unchanged under Peripheral).

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
  const q = (sql: string, params?: unknown[]) => AppDataSource.query(sql, params);

  // ---------- 1. Therapy area order_index shuffle: IC, Peripheral, Visceral, CV, Aortic ----------
  await q(`UPDATE therapy_areas SET order_index = 4 WHERE code = 'CV'`);
  await q(`UPDATE therapy_areas SET order_index = 5 WHERE code = 'AR'`);
  console.log('Reordered CV -> 4, AR -> 5');

  // ---------- 2. Rename IR row -> Visceral ----------
  await q(
    `UPDATE therapy_areas SET name = 'Visceral', code = 'VIS', slug = 'visceral', order_index = 3 WHERE code = 'IR'`,
  );
  const visceral = await q(`SELECT id FROM therapy_areas WHERE code = 'VIS'`);
  const visceralId = visceral[0].id;
  console.log('Renamed IR -> Visceral', visceralId);

  // ---------- 3. Create new Peripheral therapy area ----------
  const existingPeripheral = await q(`SELECT id FROM therapy_areas WHERE code = 'PER'`);
  let peripheralId: string;
  if (existingPeripheral.length) {
    peripheralId = existingPeripheral[0].id;
    console.log('Peripheral therapy area already exists, reusing', peripheralId);
  } else {
    const inserted = await q(
      `INSERT INTO therapy_areas (code, name, slug, order_index, is_active)
       VALUES ('PER', 'Peripheral', 'peripheral', 2, true) RETURNING id`,
    );
    peripheralId = inserted[0].id;
    console.log('Created Peripheral therapy area', peripheralId);
  }

  // ---------- 4. Rename sub-sections, re-parent Vascular Disease ----------
  await q(
    `UPDATE sub_sections SET name = 'Interventional oncology', slug = 'interventional-oncology' WHERE therapy_area_id = $1 AND slug = 'oncology'`,
    [visceralId],
  );
  await q(
    `UPDATE sub_sections SET name = 'Embolotherapy', slug = 'embolotherapy' WHERE therapy_area_id = $1 AND slug = 'non-oncological-embolization-therapies'`,
    [visceralId],
  );
  await q(
    `UPDATE sub_sections SET name = 'Peripheral', slug = 'peripheral', therapy_area_id = $1 WHERE therapy_area_id = $2 AND slug = 'vascular-disease'`,
    [peripheralId, visceralId],
  );
  console.log('Renamed sub-sections and re-parented Vascular Disease -> Peripheral TA');

  const oncologySub = await q(
    `SELECT id FROM sub_sections WHERE therapy_area_id = $1 AND slug = 'interventional-oncology'`,
    [visceralId],
  );
  const oncologySubId = oncologySub[0].id;
  const emboSub = await q(`SELECT id FROM sub_sections WHERE therapy_area_id = $1 AND slug = 'embolotherapy'`, [
    visceralId,
  ]);
  const emboSubId = emboSub[0].id;
  const peripheralSub = await q(
    `SELECT id FROM sub_sections WHERE therapy_area_id = $1 AND slug = 'peripheral'`,
    [peripheralId],
  );
  const peripheralSubId = peripheralSub[0].id;

  // ---------- 5. Oncology topics ----------
  // Drop the pre-existing empty "General" topic under Oncology (0 items) —
  // "Interventional Oncology Therapies" gets renamed to General instead below.
  await q(`DELETE FROM topics WHERE sub_section_id = $1 AND slug = 'general-oncology'`, [oncologySubId]);
  await q(
    `UPDATE topics SET name = 'General', slug = 'general', order_index = 99 WHERE sub_section_id = $1 AND slug = 'interventional-oncology-therapies'`,
    [oncologySubId],
  );
  const newOncologyTopics = [
    { name: 'Transarterial Chemoembolisation (TACE)', slug: 'tace', order: 2 },
    { name: 'Balloon Transarterial Chemoembolisation (B-TACE)', slug: 'b-tace', order: 3 },
    { name: 'Drug Eluting Bead TACE (DEB-TACE)', slug: 'deb-tace', order: 4 },
    { name: 'Access', slug: 'access', order: 5 },
  ];
  for (const t of newOncologyTopics) {
    const existing = await q(`SELECT id FROM topics WHERE sub_section_id = $1 AND slug = $2`, [oncologySubId, t.slug]);
    if (existing.length) continue;
    await q(
      `INSERT INTO topics (sub_section_id, name, slug, order_index, is_active) VALUES ($1, $2, $3, $4, true)`,
      [oncologySubId, t.name, t.slug, t.order],
    );
  }
  console.log('Oncology topics done: HCC unchanged, Therapies->General, added TACE/B-TACE/DEB-TACE/Access');

  // ---------- 6. Embolotherapy topics ----------
  await q(
    `UPDATE topics SET name = 'Musculoskeletal Embolization (MSK)', slug = 'musculoskeletal-embolization-msk' WHERE sub_section_id = $1 AND slug = 'gae'`,
    [emboSubId],
  );
  await q(
    `UPDATE topics SET name = 'Uterine Artery Embolization (UAE)', slug = 'uterine-artery-embolization-uae' WHERE sub_section_id = $1 AND slug = 'ufe'`,
    [emboSubId],
  );
  const emboAccessExisting = await q(`SELECT id FROM topics WHERE sub_section_id = $1 AND slug = 'access'`, [
    emboSubId,
  ]);
  if (!emboAccessExisting.length) {
    await q(`INSERT INTO topics (sub_section_id, name, slug, order_index, is_active) VALUES ($1, 'Access', 'access', 4, true)`, [
      emboSubId,
    ]);
  }
  console.log('Embolotherapy topics done: GAE->MSK, UFE->UAE, PAE/General unchanged, added Access');

  // ---------- 7. Peripheral topics ----------
  const peripheralNewTopics = [
    { name: 'Access', slug: 'access', order: 3 },
    { name: 'Vascular Closure', slug: 'vascular-closure', order: 4 },
  ];
  for (const t of peripheralNewTopics) {
    const existing = await q(`SELECT id FROM topics WHERE sub_section_id = $1 AND slug = $2`, [peripheralSubId, t.slug]);
    if (existing.length) continue;
    await q(
      `INSERT INTO topics (sub_section_id, name, slug, order_index, is_active) VALUES ($1, $2, $3, $4, true)`,
      [peripheralSubId, t.name, t.slug, t.order],
    );
  }
  console.log('Peripheral topics done: PAD/CLTI/General unchanged, added Access/Vascular Closure');

  // ---------- 8. Final verification dump ----------
  const finalState = await q(`
    SELECT t.code, t.name as ta_name, s.name as sub_section, top.name as topic, count(ci.id) as content_count
    FROM therapy_areas t
    JOIN sub_sections s ON s.therapy_area_id = t.id
    JOIN topics top ON top.sub_section_id = s.id
    LEFT JOIN content_items ci ON ci.topic_id = top.id AND ci.is_active = true
    WHERE t.code IN ('VIS','PER')
    GROUP BY t.code, t.name, s.name, top.name, s.order_index, top.order_index
    ORDER BY t.code, s.order_index, top.order_index
  `);
  console.log(JSON.stringify(finalState, null, 2));

  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
