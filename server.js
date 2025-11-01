const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");
require("dotenv").config(); // Asegúrate de tener dotenv instalado: npm install dotenv

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Servir index.html y otros archivos

// 🔒 Usa variable de entorno para tu conexión
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_oTne4qIE3VKR@ep-bold-firefly-a44rk8nd-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require",
  ssl: { rejectUnauthorized: false },
});

// Crear tabla si no existe
pool.query(`
  CREATE TABLE IF NOT EXISTS mensajes (
    id SERIAL PRIMARY KEY,
    nombre TEXT,
    correo TEXT,
    mensaje TEXT,
    fecha TIMESTAMP DEFAULT NOW()
  )
`).then(() => console.log("✅ Tabla 'mensajes' verificada"))
  .catch(err => console.error("❌ Error creando tabla:", err));

// Endpoint para guardar los datos
app.post("/contacto", async (req, res) => {
  try {
    const { nombre, correo, mensaje } = req.body;
    await pool.query(
      "INSERT INTO mensajes (nombre, correo, mensaje) VALUES ($1, $2, $3)",
      [nombre, correo, mensaje]
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// Endpoint para ver los mensajes guardados
app.get("/mensajes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM mensajes ORDER BY fecha DESC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// Iniciar servidor
app.listen(3000, () => console.log("🚀 Servidor en http://localhost:3000"));
