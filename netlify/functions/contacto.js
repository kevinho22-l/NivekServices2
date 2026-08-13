const { neon } = require('@netlify/neon');

const sql = neon();

const ALLOWED_ORIGIN = 'https://nivekservices.netlify.app';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        message: 'Método no permitido.',
      }),
    };
  }

  try {
    const origin = event.headers?.origin || event.headers?.Origin;

    if (origin && origin !== ALLOWED_ORIGIN) {
      return {
        statusCode: 403,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: false,
          message: 'Origen no permitido.',
        }),
      };
    }

    const { nombre, correo, mensaje, website } = JSON.parse(event.body || '{}');

    // Honeypot: los usuarios reales nunca deben completar este campo.
    if (website?.trim()) {
      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          message: 'Mensaje enviado correctamente.',
        }),
      };
    }

    const nombreLimpio = nombre?.trim();
    const correoLimpio = correo?.trim();
    const mensajeLimpio = mensaje?.trim();

    if (!nombreLimpio || !correoLimpio || !mensajeLimpio) {
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: false,
          message: 'Completa todos los campos.',
        }),
      };
    }

    if (
      nombreLimpio.length > 100 ||
      correoLimpio.length > 254 ||
      mensajeLimpio.length > 2000
    ) {
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: false,
          message: 'Uno de los campos supera el límite permitido.',
        }),
      };
    }

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correoValido.test(correoLimpio)) {
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: false,
          message: 'Ingresa un correo electrónico válido.',
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
      VALUES (${nombreLimpio}, ${correoLimpio}, ${mensajeLimpio})
    `;

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
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
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        message: 'Error interno del servidor.',
      }),
    };
  }
};