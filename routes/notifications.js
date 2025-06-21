// routes/notifications.js
const express = require('express');
const router = express.Router();
const { sendNotificationToAllUsers } = require('../controllers/notifyController');
const Notification = require('../models/notifications');

// Route: GET /api/v1/notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [['created_at', 'DESC']]
    });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Server error while fetching notifications." });
  }
});

// Route: POST /api/v1/notifications/notify-all
router.post('/notify-all', sendNotificationToAllUsers);

module.exports = router;
