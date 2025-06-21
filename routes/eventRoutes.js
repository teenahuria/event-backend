const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents,deleteEventById } = require('../controllers/eventController');
const validateEvent = require('../middlewares/validateEvent');
const authUser = require('../middlewares/authUser');

// Route to create a new event
router.post('/events', authUser, validateEvent, createEvent);

// Route to get all events (Public)
router.get('/getevents', getAllEvents);
router.delete('/events/:id', authUser, deleteEventById);
module.exports = router;
 