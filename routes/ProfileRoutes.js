const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticateUser } = require('../middlewares/profileMiddleware');
const { updateProfile, getProfile } = require('../controllers/profileController');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //console.log("dest req", req, "file ---------", file)
    // Make sure this folder exists: public/uploads
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    // Use user ID + unique suffix + original extension as filename
    // This helps avoid collisions and keeps track of user files
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // Assuming req.user has user_id from authenticateUser middleware
    cb(null, `${req.user.user_id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Initialize multer upload middleware
const upload = multer({ storage });




router.get('/getUserProfile', (req, res) => {
  // Accept image URL either from query param or JSON body
  const imagePath = req.query.path;
  console.log(imagePath)
  if (!imagePath) {
    return res.status(400).send('Please provide image path as "path" query parameter.');
  }
  // Security check: ensure the path starts with /public/
  if (!imagePath.startsWith('/public/')) {
    return res.status(400).send('Invalid image path.');
  }
  // Build absolute path on the server if needed (for example, to verify if file exists)
  const absoluteImagePath = path.join(__dirname, '..', imagePath);
   res.sendFile(absoluteImagePath);
});

// Routes
router.post('/profile', authenticateUser, getProfile);
router.post('/updateProfile', authenticateUser, upload.single('profile_pic'), updateProfile);

module.exports = router;
