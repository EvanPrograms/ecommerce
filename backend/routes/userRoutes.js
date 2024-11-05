const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { User } = require('../models')

usersRouter.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      // Handle unique constraint error
      return response.status(409).json({ error: 'Username must be unique' });
    }

    // Log the error and return a generic error response
    console.error('Error creating user:', error);
    response.status(500).json({ error: 'An error occurred while creating the user' });
  }
})
module.exports = usersRouter