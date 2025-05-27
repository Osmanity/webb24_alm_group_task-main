const sequelize = require('../config/database');
const models = require('../models');

async function migrate() {
  try {
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    console.log('Synchronizing database models...');
    await sequelize.sync({ force: false });
    console.log('Database synchronized successfully.');

    console.log('Migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  migrate();
}

module.exports = migrate; 