const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL no está configurada. El formulario no podrá guardar mensajes.');
}

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : null;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

async function ensureTable() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS mensajes (
      id SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      correo TEXT NOT NULL,
      mensaje TEXT NOT NULL,
      fecha TIMESTAMP DEFAULT NOW()
    )
  `);
}

app.post('/contacto', async (req, res) => {
  try {
    if (!pool) return res.status(500).json({ success: false, message: 'Base de datos no configurada.' });
    const { nombre, correo, mensaje } = req.body;
    if (!nombre?.trim() || !correo?.trim() || !mensaje?.trim()) {
      return res.status(400).json({ success: false, message: 'Completa todos los campos.' });
    }
    await pool.query(
      'INSERT INTO mensajes (nombre, correo, mensaje) VALUES ($1, $2, $3)',
      [nombre.trim(), correo.trim(), mensaje.trim()]
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.get('/mensajes', async (req, res) => {
  try {
    if (!pool) return res.status(500).json({ success: false, message: 'Base de datos no configurada.' });
    const result = await pool.query('SELECT * FROM mensajes ORDER BY fecha DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

ensureTable()
  .then(() => app.listen(PORT, () => console.log(`🚀 NIVEK en http://localhost:${PORT}`)))
  .catch((error) => {
    console.error('❌ No se pudo preparar la base de datos:', error);
    process.exit(1);
  });
