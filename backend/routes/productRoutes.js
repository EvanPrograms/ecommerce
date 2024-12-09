const express = require('express');
const { Sequelize, QueryTypes } = require('sequelize');
const router = express.Router();
const { sequelize } = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const products = await sequelize.query('SELECT * FROM products', { type: QueryTypes.SELECT });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
