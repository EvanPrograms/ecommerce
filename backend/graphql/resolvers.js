const { User, Cart, Product } = require('../models/')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const JWT_SECRET = process.env.JWT_SECRET
const CHOCOLATE_SHOP_EMAIL = process.env.CHOCOLATE_SHOP_EMAIL
const CHOCOLATE_SHOP_EMAIL_PASSWORD = process.env.CHOCOLATE_SHOP_EMAIL_PASSWORD

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
    createUser: async (_, { email, name, password }) => {
      // Check for unique email
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Email already in use');
      }

      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user in the database
      const user = await User.create({
        email,
        name,
        passwordHash,
      });

      return user;
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ where: { email }})
      if (!user) {
        throw new Error('User not found')
      }

      const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
      if (!passwordCorrect) {
        throw new Error('Invalid Password')
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET)

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
    },
    requestPasswordReset: async (_, { email }) => {
      const user = await User.findOne({ where: { email }})
      if (!user) throw new Error('User not found')
      const secret = JWT_SECRET + user.passwordHash
      const token = jwt.sign({ email: user.email, id: user.id }, secret, { expiresIn: '5m'})

      const resetURL = `http://localhost:5173/resetpasswordform?userId=${user.id}&token=${token}`;
      console.log('Generated Reset URL:', resetURL);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        // port: 587,
        // secure: false, // upgrade later with STARTTLS
        auth: {
          user: CHOCOLATE_SHOP_EMAIL,
          pass: CHOCOLATE_SHOP_EMAIL_PASSWORD,
        },
      });

      const message = {
        from: CHOCOLATE_SHOP_EMAIL,
        to: user.email,
        subject: "Password Reset Link for Chocolate Shop",
        text: `Please click the following link to reset your password ${resetURL}`,
        html: `<p>Please click the following link in html to reset your password ${resetURL}</p>`,
      };

      transporter.sendMail(message, function(error, info) {
        if (error) {
          console.log(error)
        } else {
          console.log('Email sent: ' + info.response)
        }
      })

      return true;
    },
    resetPassword: async (_, { userId, token, newPassword }) => {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found')
      }

      const secret = JWT_SECRET + user.passwordHash
      try {
        jwt.verify(token, secret)
        console.log('token verified successfully')
      } catch (error) {
        throw new Error('Invalid or expired token')
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      console.log('new hashed password: ', hashedPassword)
      await user.update({ passwordHash: hashedPassword})
      console.log('Password updated successfully')

      return true
    }
  },
};

module.exports = resolvers;
