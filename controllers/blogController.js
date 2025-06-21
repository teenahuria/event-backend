const pool = require('../services/db');
// const { User } = require('../models/blogs');
// Create a new blog
exports.createBlog = async (req, res) => {
    try {
const { title, description, datetime, status, published_by } = req.body;
  
      // Log input to ensure it's being received
      console.log("Received Blog:", req.body);
  
      await pool.query(
        `INSERT INTO blogs (title, description, datetime, status, published_by)
         VALUES ($1, $2, $3, $4, $5)`,
[title, description, datetime, status, published_by]
      );
  
      res.status(201).json({ message: 'Blog created successfully' });
    } catch (error) {
      console.error("Error creating blog:", error);  // Add this line
      res.status(500).json({ error: 'Server error' });
    }
  };
  


// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try { 
    const result = await pool.query(
      `SELECT 
  b.id, 
  b.title, 
  b.description, 
  b.datetime, 
  b.status, 
  b.created_at, 
  b.published_by, 
  u.name AS published_by_name
FROM blogs b
LEFT JOIN users u ON b.published_by = u.user_id;
`);
    res.json(result.rows);
        // console.log("🔍 Blog rows sent to frontend:", result.rows); // <-- Add this

  } catch (err) {
    console.error('Error fetching blogs:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all users (for the dropdown)
exports.getUsers = async (req, res) => {
  try {
    console.log("aget userse", req.body)
    const result = await pool.query('SELECT user_id, name FROM users ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
