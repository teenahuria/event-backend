// models/EventMember.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../lib/config/db_connection');
    const EventMember = sequelize.define("EventMember", {
      member_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "events", // Sequelize Events model
          key: "event_id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users", // Sequelize Users model
          key: "user_id",
        },
      },
      individual_share_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      payment_status: {
        type: DataTypes.ENUM("UNPAID", "PARTIALLY PAID", "PAID"),
        allowNull: true,
      },
      thumbs_up: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      decline_reason: {
        type: DataTypes.TEXT,
        defaultValue: "ALREADY_PAID",
      },
    }, {
      tableName: "event_members",
      timestamps: false,
    });
  
  
  module.exports = {
    EventMember
}
  