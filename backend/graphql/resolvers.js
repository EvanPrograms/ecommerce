const { User } = require('../models/')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const resolvers = {
  Query: {
    users: async () => {
      return await User.findAll(); // Fetch all users from the database
    },
  },
  Mutation: {
    createUser: async (_, { username, name, password }) => {
      // Check for unique username
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        throw new Error('Username must be unique');
      }

      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user in the database
      const user = await User.create({
        username,
        name,
        passwordHash,
      });

      return user;
    },
    login: async (_, { username, password }) => {
      const user = await User.findOne({ where: { username }})
      if (!user) {
        throw new Error('User not found')
      }

      const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
      if (!passwordCorrect) {
        throw new Error('Invalid Password')
      }

      const token = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET)

      return { value: token }
    }
  },
};

module.exports = resolvers;
