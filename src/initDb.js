const pool = require('./db');

const sql = `
  CREATE TABLE IF NOT EXISTS productos (
    id             SERIAL PRIMARY KEY,
    nombre         VARCHAR(100)   NOT NULL,
    precio         NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
    stock          INTEGER        NOT NULL DEFAULT 0 CHECK (stock >= 0),
    fecha_creacion TIMESTAMPTZ    NOT NULL DEFAULT NOW()
  );
`;

pool
  .query(sql)
  .then(() => {
    console.log('Tabla "productos" lista');
    return pool.end();
  })
  .catch((err) => {
    console.error('Error creando la tabla:', err.message);
    process.exit(1);
  });
