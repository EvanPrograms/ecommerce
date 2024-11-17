const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

const JWT_SECRET = process.env.JWT_SECRET

router.post('/', async (request, response) => {
  const { email, password } = request.body 

  try {
    const user = await User.findOne({ where: { email } })

    const passwordCorrect = user 
    ? await bcrypt.compare(password, user.passwordHash) 
    : false

    if (!(user && passwordCorrect)) {
      return response.status(401).json({ error: 'invalid email or password' })
    }

    const userForToken = {
      email: user.email,
      id: user.id,
    }

    const token = jwt.sign(userForToken, JWT_SECRET)

    response.status(200).send({ token, email: user.email, name: user.name })
  } catch (error) {
      console.error('Login error:', error)
      response.status(500).json({ error: 'Something went wrong' })
  }
})

// router.post('/forgot-password', async (req, res) => {
//   const { email } = req.body
//   try {
//     const user = await User.findOne({ email })
//     if (!user) {
//       return res.send("User does not exist")
//     }
//     const secret = JWT_SECRET + user.password
//     const token = jwt.sign({ email: user.email, id: user._id }, secret, {
//       expiresIn: "5m"
//     })
//     const link = `http://localhost:5000/graphql/${user._id}/${token}`
//     console.log("RESET LINK GENERATED"); // Replace with this
//   } catch (error) {

//   }
// })  

// router.get('/reset-password/:id/:token', async (req, res) => {
//   const { id, token} = req.params
//   console.log(req.params)
//   res.send("Done")
// })

module.exports = router