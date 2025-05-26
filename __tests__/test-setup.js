// test-setup.js
process.env.NODE_ENV = "test";
const sequelize = require("../src/config/database");
const User = require("../src/models/User");
const Accommodation = require("../src/models/Accommodation");

// Set up associations
User.hasMany(Accommodation, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});

Accommodation.belongsTo(User, {
  foreignKey: 'userId',
});

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

module.exports = { sequelize, User, Accommodation };