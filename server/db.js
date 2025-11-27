// server/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Prepare SSL for Aiven / Render
const sslOptions = process.env.DB_CA_CERT
  ? { ca: process.env.DB_CA_CERT.replace(/\\n/g, "\n"), rejectUnauthorized: true }
  : { rejectUnauthorized: false };

// Create the pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306, // default MySQL port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: sslOptions,
});

// Helper to mimic db.execute() like before
const db = {
  execute: async (sql, params) => {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(sql, params);
      return [rows];
    } finally {
      connection.release();
    }
  },
  pool, // in case you need direct access to pool
};

export default db;
