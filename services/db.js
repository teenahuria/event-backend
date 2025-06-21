const { Pool } = require('pg');
require('dotenv').config();

// Create a new pool using the DATABASE_URL from Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Needed for Railway Postgres
  }
});

module.exports = pool;
