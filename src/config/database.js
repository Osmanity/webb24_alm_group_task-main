const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

let sequelize;

if (process.env.NODE_ENV !== "test") {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.DB_PATH,
    logging: false, // Set to console.log to see SQL queries
  });
} else {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false, // Set to console.log to see SQL queries
  });
}

module.exports = sequelize;
