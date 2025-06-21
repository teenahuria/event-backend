require('dotenv').config(); // ✅ Always at the top

const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const { sequelize } = require('./lib/config/db_connection');

const app = express();
const PORT = process.env.Backend_Port || 5000; // ✅ Fallback for local

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve frontend static files
app.use('/sem/frontend', express.static(path.join(__dirname, 'sem/frontend')));
app.use('/uploads/gallery', express.static(path.join(__dirname, 'uploads/gallery')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/api/v1/public', require('./routes/public.js'));
app.use('/api/v1/public', require('./routes/users_route.js'));
app.use('/api/v2/public', require('./routes/eventRoutes'));
app.use('/api/v2/gallery', require('./routes/galleryRoutes'));
app.use('/api/v3/public', require('./routes/ProfileRoutes.js'));
app.use('/api/v4/public', require('./routes/event_edit_Routes.js'));
app.use('/api/v5/public', require('./routes/emailRoutes.js'));
app.use('/api/v6', require('./routes/LogoutRoute.js'));
app.use('/api/v7/public', require('./routes/blogRoutes'));
app.use('/api/notifications', require('./routes/notifications.js'));
app.use('/api', require('./routes/contactRoute')); // Contact route

// Start server after DB connection is confirmed
const startServer = async () => {
  try {
    let retries = 3;
    while (retries > 0) {
      try {
        await sequelize.authenticate();
        console.log("✅ Database connected successfully.");
        break;
      } catch (err) {
        retries--;
        console.warn(`❌ DB connection failed. Retries left: ${retries}`);
        if (!retries) throw err;
        await new Promise(res => setTimeout(res, 5000));
      }
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to initialize the server:", error);
    process.exit(1);
  }
};

startServer();
