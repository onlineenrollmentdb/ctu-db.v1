// server/db.js
const mysql = require('mysql2/promise');

const isLocal = process.env.NODE_ENV !== 'production';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'online_enrollment',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: !isLocal && process.env.DB_CA_CERT
    ? { ca: process.env.DB_CA_CERT, rejectUnauthorized: true }
    : undefined // no SSL for local
});

const db = {
  execute: (sql, params) => pool.execute(sql, params),
  pool
};

module.exports = db;
