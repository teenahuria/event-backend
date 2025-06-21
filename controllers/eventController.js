const jwt = require('jsonwebtoken');

const Event = require('../models/event');
const User = require('../models/users');

// Create a new event
const createEvent = async (req, res) => {
  const { title, event_type, description_text, event_datetime } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
        // decoded = jwt.verify( process.env.JWT_SECRET);
    
    const newEvent = await Event.create({
      title,
      event_type,
      description_text,
      event_datetime,
      user_id: req.user.id
    });



    return res.status(201).json({
      message: 'Event created successfully.',
      event: newEvent
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({ error: 'An error occurred while creating the event.' });
  }
};


const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      attributes: ['event_id', 'title', 'event_type', 'description_text', 'event_datetime'],
      order: [['event_datetime', 'ASC']],
    });

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    await event.destroy();

    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  deleteEventById
};
