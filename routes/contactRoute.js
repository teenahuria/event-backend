const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

// Configure Postgres connection
const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
  

// Route to handle Contact Us form POST
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  try {
    const query = `
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES ($1, $2, $3, $4)
      RETURNING id, created_at
    `;

    const values = [name, email, subject || '', message];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us!',
      contactId: result.rows[0].id,
      createdAt: result.rows[0].created_at,
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
