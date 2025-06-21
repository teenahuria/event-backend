const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:nic1234@localhost:5432/shakti', {
  logging: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load already-defined model
db.Event = require('./event');        // ✅ don't call it
db.Gallery = require('./gallery')(sequelize, Sequelize.DataTypes); // ✅ factory style

module.exports = db;


// Set up associations
if (db.Gallery.associate) {
  db.Gallery.associate(db);
}

if (db.Event.associate) {
  db.Event.associate(db);
}

module.exports = db;
