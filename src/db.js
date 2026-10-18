require('dotenv').config();
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('Falta la variable de entorno DATABASE_URL');
  process.exit(1);
}

// SSL: la URL "External" de Render (…render.com) exige SSL; la "Internal" y localhost no.
// Se puede forzar con DB_SSL=true / DB_SSL=false.
function usarSSL(url) {
  if (process.env.DB_SSL === 'true') return true;
  if (process.env.DB_SSL === 'false') return false;
  return /render\.com/.test(url);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: usarSSL(process.env.DATABASE_URL) ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
