# NIVEK Services — Portfolio

Portfolio personal de Kevin Garcia enfocado en análisis de datos, Python, automatización y desarrollo web.

## Stack

- HTML5 / CSS3 / JavaScript
- Node.js / Express
- PostgreSQL / Neon
- Netlify Functions
- Git / GitHub

## Proyecto destacado

[Workforce Performance Dashboard](https://github.com/kevinho22-l/Workforce-Dashboard) — dashboard en Python para análisis de productividad y rendimiento operativo.

## Desarrollo local

1. Instala Node.js.
2. Ejecuta `npm install`.
3. Copia `.env.example` a `.env`.
4. Configura `DATABASE_URL` con la cadena de conexión de Neon.
5. Ejecuta `npm start`.
6. Abre `http://localhost:3000`.

## Netlify

Configura la variable de entorno `DATABASE_URL` en Netlify. La función `netlify/functions/contacto.js` guarda los mensajes del formulario en PostgreSQL.

**Nunca publiques `.env` ni credenciales de Neon.**
