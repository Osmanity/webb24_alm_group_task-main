// test-setup.js
process.env.NODE_ENV = "test";
const sequelize = require("../src/config/database");
const User = require("../src/models/User");
// TODO: Add Accomodation model

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

module.exports = { sequelize, User };