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
      },
      body: JSON.stringify({
        success: false,
        message: 'Método no permitido.',
      }),
    };
  }

  try {
    const { nombre, correo, mensaje } = JSON.parse(event.body || '{}');

    if (!nombre?.trim() || !correo?.trim() || !mensaje?.trim()) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: false,
          message: 'Completa todos los campos.',
        }),
      };
    }

    await sql`
      CREATE TABLE IF NOT EXISTS mensajes (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        correo TEXT NOT NULL,
        mensaje TEXT NOT NULL,
        fecha TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      INSERT INTO mensajes (nombre, correo, mensaje)
      VALUES (${nombre.trim()}, ${correo.trim()}, ${mensaje.trim()})
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