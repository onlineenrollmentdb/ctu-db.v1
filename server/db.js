// server/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306, // 5000 is wrong for MySQL, use default 3306
  waitForConnections: true,
  connectionLimit: 10,
  ssl: process.env.DB_CA_CERT
    ? { ca: process.env.DB_CA_CERT, rejectUnauthorized: true }
    : { rejectUnauthorized: false }
});

const db = {
  execute: (sql, params) => pool.execute(sql, params),
  pool // optional, in case you need raw pool access
};

module.exports = db;
