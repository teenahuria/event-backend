const { verifyToken } = require('../utils/jwt');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("auth header", authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    console.log("token", authHeader, token);
    const decoded = verifyToken(token);
    console.log("decoded", decoded)
    req.user = decoded;
    next();
    
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
