const express = require("express");
const sequelize = require("./config/database");
const UserRouter = require("./routes/User");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Test database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    // Sync all models
    await sequelize.sync({ force: true }); // Note: force: true will drop the table if it already exists
    console.log("Database synchronized");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();

// Routes
app.use("/users", UserRouter);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
