// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Make sure this is at the top

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        console.error('JWT verification failed:', err.message); // Debug
        return res.sendStatus(403);
      }

      req.user = user;
      req.token = token;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
