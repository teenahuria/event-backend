const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadGallery');
const db = require('../models');
const Gallery = db.Gallery;

console.log('Gallery:', Gallery); // ✅ This should log the model, not undefined

router.post('/upload/:eventId', upload.array('images', 10), async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const existingCount = await Gallery.count({ where: { event_id: eventId } });

    if (existingCount + files.length > 10) {
      return res.status(400).json({ 
        error: `Upload limit exceeded: You can only upload ${10 - existingCount} more images for this event.` 
      });
    }

    const galleryEntries = files.map(file => ({
      event_id: eventId,
      image_url: `/uploads/gallery/${file.filename}`,
    }));

    await Gallery.bulkCreate(galleryEntries);

    res.status(201).json({ message: 'Images uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get all photos for a specific event
router.get('/:eventId', async (req, res) => {
  try {
    const images = await Gallery.findAll({ where: { event_id: req.params.eventId } });
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch images' });
  }
});

// Get all gallery photos (from all events)
router.get('/', async (req, res) => {
  try {
    const allImages = await Gallery.findAll();
    res.status(200).json(allImages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch gallery photos' });
  }
});

module.exports = router;
