require('dotenv').config({ quiet: true });
const { Client } = require('pg');
const fs = require('fs');
const SP = fs.readFileSync('.sp','utf8').trim();
const dec = s => s.replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&#039;|&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();
(async () => {
  const c = new Client({ host: process.env.DB_HOST, port: +process.env.DB_PORT, user: process.env.DB_USERNAME, password: process.env.DB_PASSWORD, database: process.env.DB_NAME });
  await c.connect();
  const { rows } = await c.query(`select id,title,description,is_active,file_url from content_items where content_type='ARTICLE_SUMMARY' and file_url ilike '%terumoindiaskilllab.com%' order by file_url`);
  await c.end();
  const out = [];
  for (const r of rows) {
    const html = await (await fetch(r.file_url)).text();
    const sec = (html.match(/<section class="slider_section2"[\s\S]*?<\/section>/) || [''])[0];
    const h1 = dec((sec.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [,''])[1]);
    const iframe = (sec.match(/https?:\/\/backoffice[^"' ]*?\.pdf/i) || [""])[0];
    const desc = dec(((sec.match(/<div class="description">([\s\S]*?)<\/div>/) || [,''])[1]).replace(/<[^>]+>/g,' '));
    const other = dec(sec.replace(/<iframe[\s\S]*?<\/iframe>/g,'').replace(/<[^>]+>/g,' ')).slice(0,300);
    out.push({ id: r.id, active: r.is_active, dbTitle: r.title, dbDesc: r.description, url: r.file_url, h1, iframe, desc, secLen: sec.length });
  }
  fs.writeFileSync(SP + '/old_articles.json', JSON.stringify(out, null, 1));
  for (const o of out) console.log(o.url.split('/').pop(), '|', o.active?'A':'-', '|DB:', o.dbTitle.slice(0,55), '|H1:', o.h1.slice(0,55), '|', o.iframe.replace(/.*cms_images\//,''), '| desc', o.desc.length);
})();
