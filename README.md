# API de Productos (backend)

API REST con **Node.js + Express + PostgreSQL**.

## Endpoints

| Método | Ruta | Descripción | Éxito |
|---|---|---|---|
| GET | `/api/productos` | Listar productos | 200 |
| GET | `/api/productos?nombre=texto` | Buscar por nombre | 200 |
| GET | `/api/productos/:id` | Consultar por id | 200 / 404 |
| POST | `/api/productos` | Crear | 201 |
| PUT | `/api/productos/:id` | Actualizar | 200 / 404 |
| DELETE | `/api/productos/:id` | Eliminar | 204 / 404 |

Si los datos son inválidos, la API responde **400**. Si la ruta no existe, responde **404**.

Ejemplo del cuerpo para POST y PUT:

```json
{ "nombre": "Teclado", "precio": 59.9, "stock": 10 }
```

## Tabla `productos`

`id` (SERIAL), `nombre` (VARCHAR 100), `precio` (NUMERIC 10,2), `stock` (INTEGER), `fecha_creacion` (TIMESTAMPTZ)

## Ejecutar en local

```bash
cp .env.example .env   # y pon tu DATABASE_URL
npm install
npm start              # crea la tabla si no existe y arranca la API
```

## Variables de entorno

- `DATABASE_URL`: cadena de conexión de PostgreSQL (**secreta**: va en `.env` o en las variables de Render, nunca en GitHub).
- `PORT`: Render la asigna automáticamente.
- `CORS_ORIGIN` (opcional): URL del frontend publicado.
