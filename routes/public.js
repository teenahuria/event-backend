const express = require('express');
const publicRoutes = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../services/db'); // ✅ Adjust this if your DB config file is named differently

// Middleware
const authUser = require('../middlewares/authUser');
const authToken = require('../middlewares/authToken');
const UserLogin  = require('../models/user_logins');
// Route: POST /login (handles login + token generation)
publicRoutes.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  

    const user = result.rows[0];
    // console.log("result", result, user,  email, password, user.password)
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    if(user.active===0){
        return res.status(401).json({success:false, message:"You are currently not authorized to log in. Please contact your manager for access authorization."});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("isMatch", isMatch)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // ✅ Generate token with user id and role
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    //data is entring into user_login table
    await UserLogin.create({
      user_id: user.user_id,        // Foreign Key
      ip_address:  req.headers['x-forwarded-for'] || req.connection.remoteAddress || null,   // User's IP ad dress
      user_agent: req.headers['user-agent'] || '',   // User's browser/device info
      token: token            // JWT Token
    });
    

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Route: POST /profile (protected route)
publicRoutes.post('/profile', authUser, (req, res) => {
  res.status(200).json({ success: true, message: 'Profile accessed successfully' });
});

module.exports = publicRoutes;
