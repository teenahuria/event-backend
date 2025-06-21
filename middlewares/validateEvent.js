module.exports = (req, res, next) => {
    const { event_id, title, event_type, description_text, event_datetime } = req.body;
  
    if (!title || !event_type || !description_text || !event_datetime ) {
 
      return res.status(400).json({ error: 'All fields are required.' });
    }
  
    next();
  };
  