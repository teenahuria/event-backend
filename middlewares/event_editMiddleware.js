const jwt = require('jsonwebtoken');
const { User } = require('../models/users');//event will be edit by the user
const SECRET_KEY = process.env.JWT_SECRET;

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token missing' });

    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Decoded Token:", decoded);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ error: 'Invalid user' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = { authenticateUser };
