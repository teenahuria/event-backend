// utils/helper.js

// Get Client IP from Request Headers
exports.getClientIP = (req) => {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress || null;
  };
  
  // Get User Agent from Request Headers
  exports.getUserAgent = (req) => {
    return req.headers['user-agent'] || '';
  };
  