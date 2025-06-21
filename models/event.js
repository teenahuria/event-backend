const { DataTypes } = require('sequelize');
const { sequelize } = require('../lib/config/db_connection'); // adjust path as needed

const events = sequelize.define('Event', {
  event_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  event_type: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  event_datetime: {
    type: DataTypes.DATE, // corresponds to timestamp without time zone
    allowNull: true,      // nullable as per your schema
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users', // table name in DB
      key: 'user_id',
    },
  }
}, {
  tableName: 'events',
  timestamps: false, // if you don't have createdAt/updatedAt columns
});
module.exports = events;
