// Devuelven null si el valor es válido, o un mensaje de error.

function validarId(valor) {
  if (!/^\d+$/.test(String(valor)) || Number(valor) < 1 || Number(valor) > 2147483647) {
    return 'El id debe ser un número entero positivo';
  }
  return null;
}

function validarProducto(body) {
  const errores = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return ['El cuerpo de la petición debe ser un objeto JSON'];
  }

  const { nombre, precio, stock } = body;

  if (typeof nombre !== 'string' || nombre.trim() === '') {
    errores.push('El nombre es obligatorio y debe ser texto');
  } else if (nombre.trim().length > 100) {
    errores.push('El nombre no puede superar 100 caracteres');
  }

  if (typeof precio !== 'number' || !Number.isFinite(precio) || precio < 0) {
    errores.push('El precio es obligatorio y debe ser un número mayor o igual a 0');
  } else if (precio > 99999999.99) {
    errores.push('El precio es demasiado grande');
  }

  if (!Number.isInteger(stock) || stock < 0) {
    errores.push('El stock es obligatorio y debe ser un número entero mayor o igual a 0');
  } else if (stock > 2147483647) {
    errores.push('El stock es demasiado grande');
  }

  return errores;
}

module.exports = { validarId, validarProducto };
