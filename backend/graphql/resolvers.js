const { User, Cart, Product } = require('../models/')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const resolvers = {
  Query: {
    users: async () => {
      return await User.findAll(); // Fetch all users from the database
    },
    getUserCart: async (_, { userId }) => {
      const cartItems = await Cart.findAll({
        where: { userId },
        include: [Product]
      })

      return cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    },
    getProducts: async () => {
      return await Product.findAll();
    },
    me: (root, args, context) => {
      return context.currentUser
    }
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

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET)

      return { user, token }
    },
    updateUserCart: async (_, { userId, cart }, context) => {
      // Iterate through each item in the cart
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new Error('not authenticated')
      }

      if (parseInt(context.currentUser.id, 10) !== parseInt(userId, 10)) {
        throw new Error('Unauthorized to update this cart')
      }

      for (const item of cart) {
        const { productId, quantity } = item;
    
        // Check if the cart item already exists for this user and product
        const existingCartItem = await Cart.findOne({
          where: { userId, productId }
        });
    
        if (existingCartItem) {
          // If it exists, update the quantity
          await existingCartItem.update({ quantity });
        } else {
          // If it doesn't exist, create a new cart entry
          await Cart.create({
            userId,
            productId,
            quantity,
          });
        }
      }
    
      return { message: "Cart updated successfully" };
    }
  },
};

module.exports = resolvers;
