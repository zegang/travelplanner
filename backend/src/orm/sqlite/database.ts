import { Sequelize } from 'sequelize';

// Create a Sequelize instance for SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './travelplanner.sqlite',  // Path to SQLite database file
  logging: false, // Disable SQL logging
});

export default sequelize;
