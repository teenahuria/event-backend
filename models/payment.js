const { DataTypes } = require('sequelize');
const { sequelize } = require('../lib/config/db_connection');

const Payment = sequelize.define("Payment", {
  payment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  upi_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  amount_due: {
    type: DataTypes.NUMERIC(10, 2),
    defaultValue: 0
  },
  amount_paid: {
    type: DataTypes.NUMERIC(10, 2),
    defaultValue: 0
  },
  payment_mode: {
    type: DataTypes.STRING,
    defaultValue: 'UPI'
  },
  payment_status: {
    type: DataTypes.STRING,
    defaultValue: 'PENDING'
  },
  transaction_id: {
    type: DataTypes.STRING
  },
  payment_date: {
    type: DataTypes.DATE
  },
  remarks: {
    type: DataTypes.STRING
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'payments',
  timestamps: false,
  underscored: true // <-- This is the key fix
});

module.exports = { Payment };
