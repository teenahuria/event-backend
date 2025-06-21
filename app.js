// require('dotenv').config();
require('dotenv').config(); // Place this at the very top

const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const { sequelize } = require('./lib/config/db_connection');

const app = express();
const PORT = process.env.Backend_Port;

app.use(express.json());



// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: true })); //middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// *** Serve frontend static files ***
app.use('/sem/frontend', express.static(path.join(__dirname, 'sem/frontend')));
// const paymentRoutes = require('./routes/paymentRoutes');

//routes
const publicRoutes = require('./routes/public.js');
const userRoutes = require('./routes/users_route.js');
const eventRoutes = require('./routes/eventRoutes');
const ProfileRoutes = require('./routes/ProfileRoutes.js');
const eventeditRoutes = require('./routes/event_edit_Routes.js');
const emailRoute = require('./routes/emailRoutes.js');
const LogoutRoutes = require('./routes/LogoutRoute.js');
const blogRoute= require('./routes/blogRoutes');
const notificationRoutes = require('./routes/notifications.js'); // adjust path
const galleryRoutes = require('./routes/galleryRoutes'); // ✅ 
// add this at the top
const contactRoute = require('./routes/contactRoute'); // Adjust path if needed
app.use('/uploads/gallery', express.static(path.join(__dirname, 'uploads/gallery')));
// const paymentRoutes = require('./routes/paymentRoutes');


// app.use('/api/payments',paymentRoutes);

// Use gallery API routes
app.use('/api/v2/gallery', galleryRoutes);
app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/public', userRoutes);
app.use('/api/v2/public', eventRoutes);
app.use('/api/v3/public', ProfileRoutes);
app.use('/api/v4/public', eventeditRoutes);
app.use('/api/v5/public', emailRoute);
app.use('/api/v7/public', blogRoute);
app.use('/api/notifications', notificationRoutes);
app.use('/api', contactRoute);
app.use('/api/v6', LogoutRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Initialize server with robust DB connection retry logic
const startServer = async () => {
  try {
    let retries = 3;
    while (retries > 0) {
      try {
        await sequelize.authenticate();
        console.log("✅ Database connected successfully.");
        //logger.info("✅ Database connected successfully.");
        break;
      } catch (err) {
        retries--;
        //logger.warn(`Database connection failed. Retries left: ${retries}`);
        if (!retries) throw err;
        await new Promise((res) => setTimeout(res, 5000));
      }
    }
    const server = app.listen(PORT, () => {
      //logger.info(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode.`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    console.error("❌ Failed to initialize the server:", error);
    process.exit(1);
  }
};

startServer();
