const jwt = require('jsonwebtoken');
require('dotenv').config();

const { User } = require('../models/users');
const SECRET_KEY = process.env.JWT_SECRET;

const authenticateUser = async (req, res, next) => {
  try {
    // Get auth header
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token not found' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (verifyError) {
      console.error('JWT verification error:', verifyError);
      return res.status(401).json({ error: 'Invalid token: ' + verifyError.message });
    }

    // Find user by id in token payload
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    req.user = user;
    next();

  } catch (err) {
    console.error('Authentication error:', err);
    res.status(500).json({ error: 'Server error during authentication' });
  }
};

module.exports = {
  authenticateUser
};
