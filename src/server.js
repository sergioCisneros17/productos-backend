require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productosRouter = require('./productos.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS_ORIGIN: URL del frontend (p. ej. https://mi-front.onrender.com). Si no se define, se permite cualquiera.
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de productos funcionando',
    endpoints: {
      listar: 'GET /api/productos',
      buscar: 'GET /api/productos?nombre=texto',
      consultar: 'GET /api/productos/:id',
      crear: 'POST /api/productos',
      actualizar: 'PUT /api/productos/:id',
      eliminar: 'DELETE /api/productos/:id',
    },
  });
});

app.use('/api/productos', productosRouter);

// 404 para rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  // JSON mal formado -> 400, no 500
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`API escuchando en el puerto ${PORT}`);
});
