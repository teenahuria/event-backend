const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  user: 'postgres',       // DB username
  host: 'localhost',      // DB host
  database: 'shakti',     // DB name
  password: 'nic1234',    // DB password
  port: 5432,             // DB port
});

module.exports = pool;
