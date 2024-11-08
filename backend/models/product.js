// backend/models/product.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class Product extends Model {}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  // Add other product attributes as needed
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'product'
});

module.exports = Product;
