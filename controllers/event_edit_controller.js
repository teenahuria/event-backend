const Events = require('../models/event');

const updateEvent = async (req, res) => {
  try {
    const { event_id } = req.params;
    const event = await Events.findByPk(event_id);

    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.user_id !== req.user.user_id) {
      return res.status(403).json({ error: 'You are not allowed to update this event' });
    }

    const { title, event_type, description_text, event_datetime } = req.body;

    if (title !== undefined) event.title = title;
    if (event_type !== undefined) event.event_type = event_type;
    if (description_text !== undefined) event.description_text = description_text;
    if (event_datetime !== undefined) event.event_datetime = event_datetime;

    await event.save();
    return res.json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = { updateEvent };
