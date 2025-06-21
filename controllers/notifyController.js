const jwt = require('jsonwebtoken');
const Event = require('../models/event');
const Notification = require('../models/notifications');
const { User } = require('../models/users');
const sendMail = require('../utils/sendMail');

const sendNotificationToAllUsers = async (req, res) => {
  const { subject, message, event_id, sent_by } = req.body;

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("✅ Decoded JWT:", decoded); 
  } catch (err) {
    console.error("❌ Token verification failed:", err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Ensure role exists and is numeric
  if (typeof decoded.role !== 'number') {
    return res.status(403).json({ message: 'Forbidden: Invalid role in token' });
  }

  if (decoded.role === 3) {
    return res.status(403).json({ message: 'You are not authorized to send notifications.' });
  }

  if (!subject || !message || !event_id) {
    return res.status(400).json({ message: "Subject, message, and event_id are required." });
  }

  try {
    const event = await Event.findByPk(event_id);
    if (!event) {
      return res.status(404).json({ message: `Event with ID ${event_id} not found.` });
    }

    const users = await User.findAll({ attributes: ['email'] });
    const emailList = users.map(user => user.email);

    const notification = await Notification.create({
      event_id,
      message,
      sent_by: sent_by || decoded.id,
      status: 'SENT'
    });

    for (const email of emailList) {
      await sendMail(email, subject, message);
    }

    res.status(200).json({
      message: "Notification sent to all users and stored in the database.",
      notification_id: notification.notification_id
    });
  } catch (error) {
    console.error(" Notification error:", error);
    res.status(500).json({ message: "Failed to send and store notification." });
  }
};

module.exports = { sendNotificationToAllUsers };
