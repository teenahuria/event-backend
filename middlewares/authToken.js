const {User} = require('../models/users');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

module.exports = async (req, res, next) => {
  try {
    const { userId, password } = req.body;
    console.log("userid", userId)
    const user = await User.findByPk(userId);
    console.log("user", user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("isPasswordValid", isPasswordValid, password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Password matches
    const token = generateToken({ id: userId });
    console.log("token", token);
    req.token = token;
    req.user = user;
    next();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
