// Optional: token blacklist utility
// const { blacklistToken } = require('../utils/blacklist');

exports.logoutUser = async (req, res) => {
  return res.status(200).json({
    message: 'Logout successful. Please delete the token on the client side.'
  });
};
