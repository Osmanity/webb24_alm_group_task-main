const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

let sequelize;

if (process.env.NODE_ENV !== "test") {
  // Production/Development PostgreSQL configuration
  sequelize = new Sequelize({
    dialect: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "webb24_alm_db",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Test environment - use in-memory SQLite for testing
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false, // Set to console.log to see SQL queries
  });
}

module.exports = sequelize;
