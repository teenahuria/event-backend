const express = require('express');
const router = express.Router();
const { logoutUser } = require('../controllers/logoutController');
const { authenticateJWT } = require('../middlewares/logoutmiddleware');

router.post('/logout', authenticateJWT, logoutUser);

module.exports = router;
