const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/db');
const jwt = require('jsonwebtoken')

let cart = {}

router.get('/', async (req, res) => {
  res.json(cart)
})

router.post('/', async (req, res) => {
  const { cartItems } = req.body

  Object.keys(cartItems).forEach(id => {
    cart[id] = cartItems[id]
  })
  res.status(201).json({ message: 'Cart updated successfully' })
})

module.exports = router