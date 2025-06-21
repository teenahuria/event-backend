const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../services/db');
const validateInput = require('../middlewares/validateInput');
const authenticateToken = require('../middlewares/authenticateToken');
const authorizeRoles = require('../middlewares/authorizeRoles');
const { generateToken } = require('../utils/jwt');

const router = express.Router();

// Signup Route
router.post('/signup', validateInput, async (req, res) => {
  const { name, password } = req.body;
  const email = req.body.email.trim().toLowerCase(); // ✅ Normalize

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE lower(email) = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email, role',
      [name, email, hashedPassword, 3] // ✅ use lowercase email
    );

    res.status(201).json({
      message: 'User registered successfully.',
      user: newUser.rows[0],
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already exists.' });
    }

    console.error('Error during signup:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});



// Activate/deactivate user (requires token and admin roles)
router.put('/user/:id/activate', authenticateToken, authorizeRoles([0, 1, 2]), async (req, res) => {
    const { id } = req.params;
    const { active } = req.body;

    try {
      await pool.query(
        'UPDATE users SET active = $1 WHERE user_id = $2',
        [active, id]
      );
      res.status(200).json({ message: 'User activation status updated.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Get all users (requires token)
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT user_id, name FROM users WHERE active = true');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
