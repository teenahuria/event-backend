const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/event_editMiddleware');
const { updateEvent } = require('../controllers/event_edit_controller');

router.put('/events/:event_id', authenticateUser, updateEvent);

module.exports = router;
