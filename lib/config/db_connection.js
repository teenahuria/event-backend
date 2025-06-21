const { Sequelize } = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    ...(process.env.NODE_ENV === "production" && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // Match FastAPI SSL settings
        }
      }
    })
  });
  
  
module.exports = { sequelize };













