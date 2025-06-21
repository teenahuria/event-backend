const express       = require('express');
const router        = express.Router();
const { createEvent, listEvents } = require('../controllers/eventController');
const {
  forgotPassword,
  verifyOtp,
  resetPassword,
    
} = require('../controllers/emailController');
// const validateEvent = require('../middlewares/validateEvent');
const authUser      = require('../middlewares/authUser');


router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

router.post('/resend-otp', forgotPassword); 

module.exports = router;
