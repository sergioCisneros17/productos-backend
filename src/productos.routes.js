const express = require('express');
const pool = require('./db');
const { validarId, validarProducto } = require('./validaciones');

const router = express.Router();

// NUMERIC llega como texto desde pg: lo convertimos a número.
const formatear = (p) => ({ ...p, precio: Number(p.precio) });

// GET /api/productos            -> lista todos
// GET /api/productos?nombre=abc -> busca por nombre (sin distinguir mayúsculas)
router.get('/', async (req, res, next) => {
  try {
    const { nombre } = req.query;
    let result;
    if (nombre !== undefined) {
      if (typeof nombre !== 'string') {
        return res.status(400).json({ error: 'El parámetro nombre debe ser texto' });
      }
      result = await pool.query(
        'SELECT * FROM productos WHERE nombre ILIKE $1 ORDER BY id',
        [`%${nombre.trim()}%`]
      );
    } else {
      result = await pool.query('SELECT * FROM productos ORDER BY id');
    }
    res.status(200).json(result.rows.map(formatear));
  } catch (err) {
    next(err);
  }
});

// GET /api/productos/:id
router.get('/:id', async (req, res, next) => {
  try {
    const errorId = validarId(req.params.id);
    if (errorId) return res.status(400).json({ error: errorId });

    const result = await pool.query('SELECT * FROM productos WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    res.status(200).json(formatear(result.rows[0]));
  } catch (err) {
    next(err);
  }
});

// POST /api/productos
router.post('/', async (req, res, next) => {
  try {
    const errores = validarProducto(req.body);
    if (errores.length) return res.status(400).json({ error: 'Datos inválidos', detalles: errores });

    const { nombre, precio, stock } = req.body;
    const result = await pool.query(
      'INSERT INTO productos (nombre, precio, stock) VALUES ($1, $2, $3) RETURNING *',
      [nombre.trim(), precio, stock]
    );
    res.status(201).json(formatear(result.rows[0]));
  } catch (err) {
    next(err);
  }
});

// PUT /api/productos/:id
router.put('/:id', async (req, res, next) => {
  try {
    const errorId = validarId(req.params.id);
    if (errorId) return res.status(400).json({ error: errorId });

    const errores = validarProducto(req.body);
    if (errores.length) return res.status(400).json({ error: 'Datos inválidos', detalles: errores });

    const { nombre, precio, stock } = req.body;
    const result = await pool.query(
      'UPDATE productos SET nombre = $1, precio = $2, stock = $3 WHERE id = $4 RETURNING *',
      [nombre.trim(), precio, stock, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    res.status(200).json(formatear(result.rows[0]));
  } catch (err) {
    next(err);
  }
});

// DELETE /api/productos/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const errorId = validarId(req.params.id);
    if (errorId) return res.status(400).json({ error: errorId });

    const result = await pool.query('DELETE FROM productos WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
