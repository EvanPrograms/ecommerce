const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

const JWT_SECRET = process.env.JWT_SECRET

router.post('/', async (request, response) => {
  const { username, password } = request.body 

  try {
    const user = await User.findOne({ where: { username } })

    const passwordCorrect = user 
    ? await bcrypt.compare(password, user.passwordHash) 
    : false

    if (!(user && passwordCorrect)) {
      return response.status(401).json({ error: 'invalid username or password' })
    }

    const userForToken = {
      username: user.username,
      id: user.id,
    }

    const token = jwt.sign(userForToken, JWT_SECRET)

    response.status(200).send({ token, username: user.username, name: user.name })
  } catch (error) {
      console.error('Login error:', error)
      response.status(500).json({ error: 'Something went wrong' })
  }
})

  

module.exports = router