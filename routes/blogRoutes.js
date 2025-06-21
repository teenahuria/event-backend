const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.post('/createblog', blogController.createBlog);
router.get('/blogs', blogController.getAllBlogs);
router.get('/users', blogController.getUsers); // for "Publish By" dropdown

module.exports = router;
