const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config(); // Load .env variables

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load already-defined model
db.Event = require('./event');        // ✅ model file handles its own export
db.Gallery = require('./gallery')(sequelize, Sequelize.DataTypes); // ✅ factory style

// Set up associations
if (db.Gallery.associate) {
  db.Gallery.associate(db);
}

if (db.Event.associate) {
  db.Event.associate(db);
}

module.exports = db;
