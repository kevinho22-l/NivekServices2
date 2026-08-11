const { neon } = require('@netlify/neon');

const sql = neon();

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        message: 'Método no permitido.',
      }),
    };
  }

  try {
    const { nombre, correo, mensaje } = JSON.parse(event.body || '{}');

    const nombreLimpio = nombre?.trim();
    const correoLimpio = correo?.trim();
    const mensajeLimpio = mensaje?.trim();

    // Validar campos obligatorios
    if (!nombreLimpio || !correoLimpio || !mensajeLimpio) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          message: 'Completa todos los campos.',
        }),
      };
    }

    // Limitar el tamaño de los datos recibidos
    if (
      nombreLimpio.length > 100 ||
      correoLimpio.length > 254 ||
      mensajeLimpio.length > 2000
    ) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          message: 'Uno de los campos supera el límite permitido.',
        }),
      };
    }

    // Validación básica del correo electrónico
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correoValido.test(correoLimpio)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          success: false,
          message: 'Ingresa un correo electrónico válido.',
        }),
      };
    }

    // Crear la tabla si todavía no existe
    await sql`
      CREATE TABLE IF NOT EXISTS mensajes (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        correo TEXT NOT NULL,
        mensaje TEXT NOT NULL,
        fecha TIMESTAMP DEFAULT NOW()
      )
    `;

    // Guardar el mensaje
    await sql`
      INSERT INTO mensajes (nombre, correo, mensaje)
      VALUES (${nombreLimpio}, ${correoLimpio}, ${mensajeLimpio})
    `;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        message: 'Mensaje enviado correctamente.',
      }),
    };
  } catch (error) {
    console.error('Error en contacto:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        message: 'Error interno del servidor.',
      }),
    };
  }
};