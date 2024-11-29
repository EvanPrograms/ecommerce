const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL)

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database', err.message || err)
    return process.exit(1)
  }
  return null
}

module.exports = { sequelize, connectToDatabase }
