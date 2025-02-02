const { Pool } = require('pg');
require('dotenv').config();

// Forcer la conversion du port en nombre
const port = parseInt(process.env.DB_PORT, 10);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: port, // Utilisation de la variable convertie
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Ajout des options de connexion spécifiques
  connectionTimeoutMillis: 5000,
  ssl: false
});

// Log de la configuration
console.log('Configuration DB:', {
  host: process.env.DB_HOST,
  port: port,
  user: process.env.DB_USER,
  database: process.env.DB_NAME
});

module.exports = pool;