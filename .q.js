require('dotenv').config({ quiet: true });
const { Client } = require('pg');
(async () => {
  const c = new Client({ host: process.env.DB_HOST, port: +process.env.DB_PORT, user: process.env.DB_USERNAME, password: process.env.DB_PASSWORD, database: process.env.DB_NAME });
  await c.connect();
  const r = await c.query(process.argv[2]);
  console.log(JSON.stringify(r.rows, null, 1));
  await c.end();
})().catch(e => { console.error(e.message); process.exit(1); });
