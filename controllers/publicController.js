
const bcrypt = require('bcryptjs');

const { User } = require('../models/users');
const { generateToken } = require('../utils/jwt'); // Import token generation function
const { getClientIP, getUserAgent } = require('../utils/helper');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the hashed password with the stored password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // If credentials are valid, generate the JWT token
    const token = generateToken({ user_id: user.user_id });

    // Get the client IP and user agent
    const ipAddress = getClientIP(req);
    const userAgent = getUserAgent(req);

    // Save the login entry (you can log this as per your service logic)
    await publicService.saveLoginEntry(user.user_id, token, ipAddress, userAgent);

    // Return the token in the response
    res.status(200).json({
      message: 'Login successful',
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
};

module.exports = {
  login
};
