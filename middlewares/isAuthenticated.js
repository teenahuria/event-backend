// middleware/isAuthenticated.js
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user_id) {
    return next(); // ✅ Allow access
  } else {
    return res.status(401).json({ message: 'Unauthorized. Please login.' });
  }
}

module.exports = isAuthenticated;
