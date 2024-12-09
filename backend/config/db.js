const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database');
  } catch (err) {
    console.error('Failed to connect to the database', err.message || err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectToDatabase };
