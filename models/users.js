const { DataTypes } = require('sequelize');
const { sequelize } = require('../lib/config/db_connection');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  role: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['ADMIN', 'EVENTMANAGER', 'SUPERADMIN', 'USER']]
    }
  },
  email: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  active: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  otp_expiry: {
    type: DataTypes.DATE,
    allowNull: true
  },
  profile_pic: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  upi_id: {
    type: DataTypes.STRING(200),
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: false,
  schema: 'public'
});

module.exports = { User };
