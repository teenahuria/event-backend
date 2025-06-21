// models/UserLogin.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../lib/config/db_connection');

const UserLogin = sequelize.define('UserLogin', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // table name
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  login_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ip_address: {
    type: DataTypes.STRING(100),
  },
  user_agent: {
    type: DataTypes.TEXT,
  },
  token: {
    type: DataTypes.STRING(500),
  },
}, {
  tableName: 'user_logins',
  timestamps: false, // because you are already manually using login_time
});

module.exports = UserLogin;
