require('dotenv').config({ quiet: true });
const { Client } = require('pg'); const fs = require('fs');
const SP = fs.readFileSync('.sp','utf8').trim();
const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
(async () => {
  const c = new Client({ host: process.env.DB_HOST, port: +process.env.DB_PORT, user: process.env.DB_USERNAME, password: process.env.DB_PASSWORD, database: process.env.DB_NAME });
  await c.connect();
  const { rows } = await c.query(`select ci.id,ci.title,ci.is_active,ci.file_url,t.name topic from content_items ci join topics t on t.id=ci.topic_id where content_type='ARTICLE_SUMMARY'`);
  await c.end();
  const old = JSON.parse(fs.readFileSync(SP + '/old_articles.json'));
  const gcs = rows.filter(r => /storage.googleapis/.test(r.file_url));
  let match = 0, mism = 0;
  for (const o of old) {
    const same = norm(o.dbTitle).slice(0,40) === norm(o.h1).slice(0,40);
    if (same) { match++; continue; }
    mism++;
    const key = norm(o.h1).slice(0,35);
    const hit = gcs.filter(g => norm(g.title).includes(key) || key.includes(norm(g.title).slice(0,35)));
    console.log(o.url.split('/').pop(), '| REAL:', o.h1.slice(0,60), '=> in DB as GCS item?', hit.length ? hit.map(h=>h.title.slice(0,50)+' ('+h.file_url.split('/').pop()+')').join(' ; ') : 'NO');
  }
  console.log({ titleMatchesPage: match, mismatched: mism });
  // topic for the mismatched db rows
  const tt = rows.filter(r=>/terumoindiaskilllab/.test(r.file_url)); const top = {}; tt.forEach(r=>top[r.topic]=(top[r.topic]||0)+1); console.log(top);
})();
