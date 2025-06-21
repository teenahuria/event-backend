// models
const UserLogin  = require('../models/user_logins'); // Assuming Sequelize model is correctly imported
const saveLoginEntry = async (userId, token, ipAddress, userAgent) => {
  try {
    // Save login time to db along with other details
    const loginEntry = await UserLogin.create({
      user_id: userId,        // Foreign Key
      ip_address: ipAddress,   // User's IP ad dress
      user_agent: userAgent,   // User's browser/device info
      token: token,            // JWT Token
    });

    console.log('Login entry created:', loginEntry);
    return loginEntry;
  } catch (error) {
    console.error('Error saving login entry:', error);
    throw new Error('Failed to save login entry');
  }
};


module.exports = {
  saveLoginEntry,
}


