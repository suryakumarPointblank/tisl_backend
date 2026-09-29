require('dotenv').config({ quiet: true });
const { Client } = require('pg');
const fs = require('fs');
const SP = fs.readFileSync('.sp','utf8').trim();
(async () => {
  const c = new Client({ host: process.env.DB_HOST, port: +process.env.DB_PORT, user: process.env.DB_USERNAME, password: process.env.DB_PASSWORD, database: process.env.DB_NAME });
  await c.connect();
  const { rows } = await c.query(`select id,title,content_type,is_active,file_url,thumbnail_url,content_data from content_items`);
  await c.end();
  // collect (item, field, url)
  const refs = [];
  const walk = (id, base, v) => {
    if (typeof v === 'string' && /^https?:\/\//.test(v)) refs.push({ id, field: base, url: v });
    else if (Array.isArray(v)) v.forEach((x, i) => walk(id, `${base}[${i}]`, x));
    else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(id, `${base}.${k}`, x));
  };
  for (const r of rows) {
    walk(r.id, 'file_url', r.file_url); walk(r.id, 'thumbnail_url', r.thumbnail_url); walk(r.id, 'content_data', r.content_data);
  }
  const byId = Object.fromEntries(rows.map(r => [r.id, r]));
  const uniq = [...new Set(refs.filter(r => !/terumoindiaskilllab|vimeo\.com|youtube\.com|terumoindia\.com/.test(r.url)).map(r => r.url))];
  console.log('refs', refs.length, 'unique-to-probe (gcs/other)', uniq.length);
  const res = {};
  let i = 0;
  async function probe(u) {
    try {
      const r = await fetch(u, { method: 'GET', headers: { Range: 'bytes=0-1023' }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
      const buf = Buffer.from(await r.arrayBuffer());
      res[u] = { status: r.status, ct: r.headers.get('content-type'), len: r.headers.get('content-range') || r.headers.get('content-length'), magic: buf.slice(0, 5).toString('latin1') };
    } catch (e) { res[u] = { status: 0, err: String(e.cause?.code || e.message) }; }
  }
  await Promise.all(Array.from({ length: 16 }, async () => { while (i < uniq.length) await probe(uniq[i++]); }));
  fs.writeFileSync(SP + '/audit.json', JSON.stringify({ refs, res }, null, 1));
  const sum = {};
  for (const [u, x] of Object.entries(res)) { const k = `${x.status} ${x.ct}${u.match(/\.pdf/i) ? ' [.pdf url]' : ''}${x.magic === '%PDF-' ? ' [PDF magic]' : ''}`; sum[k] = (sum[k] || 0) + 1; }
  console.log(sum);
})();
