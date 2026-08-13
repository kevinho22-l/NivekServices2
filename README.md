# NIVEK Services — Professional Portfolio

[![Live Site](https://img.shields.io/badge/Live%20Site-nivekservices.netlify.app-00C7B7?style=for-the-badge)](https://nivekservices.netlify.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/kevinho22-l/NivekServices2)
[![Status](https://img.shields.io/badge/Status-Production-success?style=for-the-badge)](https://nivekservices.netlify.app/)

Portfolio profesional de **Kevin Garcia**, enfocado en análisis de datos, Python, automatización, bases de datos y desarrollo web.

🌐 **Sitio en producción:** https://nivekservices.netlify.app/

---

## 📌 Sobre el proyecto

**NIVEK Services** es un proyecto web desarrollado como parte de mi portafolio profesional.

La aplicación presenta mi perfil, servicios y proyectos, e incorpora un formulario de contacto conectado a un backend serverless. Los mensajes enviados por los visitantes se almacenan en una base de datos PostgreSQL administrada mediante Neon.

El proyecto demuestra la integración práctica de diferentes componentes de una aplicación moderna:

- Frontend web.
- JavaScript para interacción y comunicación con el backend.
- Backend serverless.
- Base de datos PostgreSQL.
- Servicios cloud.
- Control de versiones con Git/GitHub.
- Deploy en producción mediante Netlify.

---

## 🌐 Demo

**Sitio web:**  
https://nivekservices.netlify.app/

**Repositorio:**  
https://github.com/kevinho22-l/NivekServices2

---

## ✨ Características

### Interfaz

- Diseño responsive para escritorio y dispositivos móviles.
- Navegación adaptable.
- Secciones de presentación profesional.
- Presentación de servicios.
- Presentación de proyectos.
- Animaciones y elementos visuales de interfaz.
- Formulario de contacto.

### Formulario de contacto

- Envío de información mediante `POST`.
- Comunicación con una Netlify Function.
- Validación de campos obligatorios.
- Validación básica del correo electrónico.
- Límites de longitud para los datos recibidos.
- Mensajes de respuesta para el usuario.
- Manejo de errores.
- Protección básica contra bots mediante honeypot.

### Backend y datos

- Netlify Functions como backend serverless.
- PostgreSQL como sistema de base de datos.
- Neon como servicio de PostgreSQL.
- Persistencia de los mensajes recibidos.
- Variables de entorno para información sensible.

---

## 🏗️ Arquitectura

El flujo principal del formulario de contacto es:

```text
┌─────────────────────┐
│       Usuario       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Formulario HTML  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     JavaScript      │
│       fetch()       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Netlify Function   │
│     contacto.js     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   @netlify/neon     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ PostgreSQL / Neon   │
│     mensajes        │
└─────────────────────┘
```

La arquitectura serverless permite que el backend sea ejecutado por Netlify sin depender de que el computador local esté encendido.

---

## 🛠️ Stack tecnológico

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js
- Netlify Functions
- `@netlify/neon`

### Base de datos

- PostgreSQL
- Neon

### Control de versiones

- Git
- GitHub

### Deployment

- Netlify

### Desarrollo

- Visual Studio Code
- Windows
- npm

---

## 🔐 Seguridad

El formulario incorpora varias medidas de protección para reducir entradas inválidas y automatizadas.

### Validación de entrada

Los datos recibidos son limpiados mediante `trim()` y se comprueba que los campos obligatorios tengan contenido.

También existen límites de longitud:

| Campo | Límite |
|---|---:|
| Nombre | 100 caracteres |
| Correo | 254 caracteres |
| Mensaje | 2000 caracteres |

### Validación del correo

Se realiza una validación básica del formato del correo electrónico antes de almacenar la información.

### Honeypot

El formulario incluye un campo oculto destinado a detectar envíos automatizados.

Los usuarios normales no interactúan con este campo, mientras que determinados bots pueden completarlo automáticamente.

### Variables sensibles

Las credenciales de conexión a la base de datos se gestionan mediante variables de entorno.

Las credenciales reales no se almacenan directamente en el código fuente.

> Nunca publiques `.env` ni credenciales de Neon en GitHub.

### Dependencias

Las dependencias del proyecto fueron revisadas utilizando:

```bash
npm audit --omit=dev
```

y posteriormente:

```bash
npm audit fix
```

El proyecto quedó con:

```text
0 vulnerabilities
```

> Estas medidas representan una capa de seguridad básica para el proyecto y no sustituyen una estrategia de seguridad completa para aplicaciones de mayor escala.

---

## 📂 Estructura principal

```text
NivekServices2-Git/
│
├── netlify/
│   └── functions/
│       └── contacto.js
│
├── index.html
├── style.css
├── script.js
├── package.json
├── package-lock.json
├── netlify.toml
├── .env.example
└── README.md
```

---

## ⚙️ Funcionamiento del formulario

Cuando un visitante completa el formulario:

1. JavaScript captura los datos.
2. Se envía una petición `POST` a:

```text
/.netlify/functions/contacto
```

3. Netlify ejecuta `contacto.js`.
4. La función valida los datos recibidos.
5. Neon establece la comunicación con PostgreSQL.
6. El mensaje se almacena en la tabla `mensajes`.
7. El backend devuelve una respuesta al frontend.
8. El usuario recibe una confirmación de envío.

Respuesta exitosa:

```json
{
  "success": true,
  "message": "Mensaje enviado correctamente."
}
```

---

## 🗄️ Base de datos

La función crea la tabla `mensajes` cuando es necesario:

```sql
CREATE TABLE IF NOT EXISTS mensajes (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT NOW()
);
```

Los mensajes almacenan:

- Identificador.
- Nombre.
- Correo electrónico.
- Mensaje.
- Fecha y hora de recepción.

---

## 🚀 Instalación y desarrollo local

### Requisitos

Antes de ejecutar el proyecto localmente necesitas:

- Node.js
- npm
- Git
- Una base de datos PostgreSQL/Neon para probar la funcionalidad de contacto.

### 1. Clonar el repositorio

```bash
git clone https://github.com/kevinho22-l/NivekServices2.git
```

### 2. Entrar al proyecto

```bash
cd NivekServices2
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar variables de entorno

Copia:

```text
.env.example
```

como:

```text
.env
```

y configura la conexión:

```env
DATABASE_URL=tu_cadena_de_conexion
```

> No compartas ni subas el archivo `.env`.

### 5. Ejecutar

```bash
npm start
```

Después abre:

```text
http://localhost:3000
```

---

## ☁️ Deployment

El proyecto está desplegado en **Netlify** y conectado al repositorio de GitHub.

Flujo de deployment:

```text
GitHub
   │
   ▼
Push a master
   │
   ▼
Netlify
   │
   ├── Sitio web
   │
   └── Netlify Functions
           │
           ▼
       Neon / PostgreSQL
```

Cada actualización publicada en el repositorio puede ser utilizada por Netlify para generar una nueva versión del sitio.

---

## 📊 Proyecto destacado — Workforce Performance Dashboard

Además de NIVEK Services, uno de los proyectos principales de mi portafolio es:

### Workforce Performance Dashboard

Dashboard desarrollado en **Python** orientado al análisis de productividad y rendimiento operativo.

El proyecto incluye:

- Procesamiento de datos.
- Limpieza de información.
- Cálculo de KPIs.
- Análisis de llamadas.
- Análisis de ventas.
- Análisis de AHT.
- Visualización de métricas.
- Interfaz gráfica.

🔗 **Repositorio:**  
https://github.com/kevinho22-l/Workforce-Dashboard

---

## 📈 Objetivos de aprendizaje y desarrollo

NIVEK Services forma parte de mi proceso de desarrollo profesional y busca demostrar experiencia práctica en:

- Desarrollo web.
- JavaScript.
- Python.
- Análisis de datos.
- Automatización.
- SQL y bases de datos.
- PostgreSQL.
- Integración de servicios cloud.
- Arquitecturas serverless.
- Git y GitHub.
- Deployment.
- Validación y protección básica de aplicaciones.

---

## 🧪 Pruebas realizadas

Durante el desarrollo se realizaron diferentes comprobaciones, incluyendo:

### Validación de JavaScript

```bash
node --check netlify/functions/contacto.js
```

### Verificación de Neon

```bash
node -e "require('@netlify/neon'); console.log('NEON OK')"
```

### Auditoría de dependencias

```bash
npm audit --omit=dev
```

### Corrección de vulnerabilidades

```bash
npm audit fix
```

### Control de cambios

```bash
git status
git diff
```

---

## 📱 Compatibilidad

El sitio está diseñado para funcionar en:

- 💻 Computadores de escritorio.
- 💻 Portátiles.
- 📱 Teléfonos móviles.
- 📱 Tablets.

El backend serverless y la base de datos se ejecutan en servicios cloud, por lo que el funcionamiento del sitio en producción no depende de que el computador utilizado durante el desarrollo permanezca encendido.

---

## 🔒 Buenas prácticas utilizadas

- Separación entre frontend y backend.
- Uso de variables de entorno.
- No almacenar credenciales directamente en el repositorio.
- Validación de entradas.
- Límites de tamaño de datos.
- Manejo de errores.
- Control de versiones.
- Auditoría de dependencias.
- Deploy mediante infraestructura cloud.
- Uso de servicios serverless para el backend.

---

## 👨‍💻 Autor

### Kevin Garcia

Perfil orientado al desarrollo de soluciones mediante:

**Python · Análisis de Datos · SQL · Automatización · Desarrollo Web · Bases de Datos**

### GitHub

https://github.com/kevinho22-l

### Portfolio

https://nivekservices.netlify.app/

---

## 📌 Estado del proyecto

**Estado:** 🟢 En producción

El proyecto continúa formando parte de mi portafolio profesional y puede evolucionar con nuevas funcionalidades y mejoras.

---

⭐ Gracias por visitar **NIVEK Services**.
