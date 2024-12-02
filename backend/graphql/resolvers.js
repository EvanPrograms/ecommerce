const { User, Cart, Product, CheckoutSession, Order, Review } = require('../models/')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET
const CHOCOLATE_SHOP_EMAIL = process.env.CHOCOLATE_SHOP_EMAIL
const CHOCOLATE_SHOP_EMAIL_PASSWORD = process.env.CHOCOLATE_SHOP_EMAIL_PASSWORD
const STRIPE_KEY = process.env.STRIPE_KEY
const PRICE_ID = process.env.PRICE_ID
const DOMAIN = process.env.HOST

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
        id: item.id,
        productId: item.productId,
        quantity: item.quantity
      }))
    },
    getProducts: async () => {
      const products = await Product.findAll({
        order: [['id', 'ASC']]
      });

      return products.map(product => product.toJSON())
    },
    getProduct: async ({ productId }) => {
      return await Product.findByPk(productId)
    },
    getReviews: async (_, { productId }) => {
      console.log('Fetching reviews for productId:', productId);
      const reviews = await Review.findAll({
        where: { productId }
      });

      return reviews.map(review => ({
        ...review.toJSON(),
        createdAt: new Date(review.createdAt).toISOString()
      }));
    },
    me: (root, args, context) => {
      return context.currentUser
    },
    getOrderHistory: async (_, __, { currentUser }) => {
      if (!currentUser) {
        throw new Error('Not authenticated');
      }
    
      const orders = await Order.findAll({
        where: { userId: currentUser.id },
        order: [['orderDate', 'DESC']],
      });
    
      return orders.map(async (order) => {
        console.log("Raw shippingAddress from DB:", order.shippingAddress); // Debugging
    
        const shippingAddress = order.shippingAddress
          ? JSON.parse(order.shippingAddress) // Ensure it is parsed correctly
          : null;

        const itemsWithReviewStatus = await Promise.all(
          order.items.map( async (item) => {
            const hasReview = await Review.findOne({
              where: {
                userId: currentUser.id,
                productId: item.productId
              }
            })

            return {
              ...item,
              hasLeftReview: !!hasReview
            }
          })
        )
    
        console.log("Parsed shippingAddress:", shippingAddress); // Debugging
    
        return {
          ...order.toJSON(),
          items: itemsWithReviewStatus,
          shippingAddress: shippingAddress
            ? {
                line1: shippingAddress.line1,
                line2: shippingAddress.line2 || null,
                city: shippingAddress.city,
                state: shippingAddress.state,
                postal_code: shippingAddress.postal_code,
                country: shippingAddress.country,
              }
            : null,
            orderDate: new Date(order.orderDate).toISOString()
        };
      });
    },
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

      if (!userId) {
        throw new Error('No user id')
      }

      const cartData = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        userId: currentUser.id, // Authenticated user
      }));


      for (const item of cartData) {
        const existingCartItem = await Cart.findOne({
          where: { 
            userId: item.userId, 
            productId: item.productId
          }
        });
    
        if (existingCartItem) {
          // If it exists, update the quantity
          await existingCartItem.update({ quantity: item.quantity });
        } else {
          // If it doesn't exist, create a new cart entry
          await Cart.create(item);
        }
      }
    
      return { message: "Cart updated successfully" };
    },
    requestPasswordReset: async (_, { email }) => {
      const user = await User.findOne({ where: { email }})
      if (!user) throw new Error('User not found')
      const secret = JWT_SECRET + user.passwordHash
      const token = jwt.sign({ email: user.email, id: user.id }, secret, { expiresIn: '5m'})

      const resetURL = `${DOMAIN}/resetpasswordform?userId=${user.id}&token=${token}`;      console.log('Generated Reset URL:', resetURL);

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
    },
    createCheckoutSession: async (_, { cartItems }, context) => {
      const stripe = require('stripe')(STRIPE_KEY)
      const randomValue = uuidv4()

      try {
        const session = await stripe.checkout.sessions.create({
          line_items: cartItems.map((item) => ({
            price_data: {
              currency: 'usd',
              product_data: { name: item.name },
              unit_amount: item.price
            },
            quantity: item.quantity
          })),
          mode: 'payment',
          success_url: `${DOMAIN}/success/${randomValue}`,
          cancel_url: `${DOMAIN}/cancel`, 
          billing_address_collection: 'required',
          shipping_address_collection: {
            allowed_countries: ['US', 'CA']
          },
          metadata: {
            userId: context.currentUser ? context.currentUser.id : null,
            cartItems: JSON.stringify(cartItems), // Pass cart items as JSON
          },
        })

        if (context.currentUser) {
          await CheckoutSession.create({
            randomValue,
            sessionId: session.id,
            userId: context.currentUser.id
          })
        } else {
          console.log('Guest checkout session created: ', session.id)
        }

        

        return { url: session.url }
      } catch (error) {
        console.error('Stripe error: ', error)
        throw new Error('Failed to create checkout session')
      }
    },
    clearCart: async (_, __, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new Error('Not Authenticated')
      }
      
      try {
        await Cart.destroy({
          where: { userId: context.currentUser.id }
        })
        return true
      } catch (error) {
        console.error('Error clearing cart: ', error)
        throw new Error('Failed to clear cart')
      }
    },
    validateSuccess: async (_, { randomValue }, context) => {

      const sessionData = await CheckoutSession.findOne({
        where: { randomValue, userId: context.currentUser.id }
      })

      if (!sessionData) {
        throw new Error('Invalid or expired success link')
      }

      const userType = sessionData.userId && sessionData.userId !== '' ? 'authenticated' : 'guest';
      console.log('This is userType', userType)

      if (userType === 'authenticated' && context.currentUser?.id === sessionData.userId) {
        const order = await Order.findOne({
          where: { sessionId: sessionData.sessionId}
        })

        if (!order) {
          throw new Error('Order not found for this session')
        }

        for (const item of order.items) {
          const product = await Product.findByPk(item.productId)
          if (product) {
            await product.increment('totalQuantityOrdered', { by: item.quantity})
          }
        }
      } else if (userType === 'guest') {
        console.log("Guest checkout, no user ID found.");
      } else {
        throw new Error('Not authenticated')
      }

      await CheckoutSession.destroy({ where: { randomValue }})

      return { success: true, userType }
    },
    createReview: async (_, { productId, review, stars }, context) => {
      const currentUser = context.currentUser
      
      if (!currentUser) {
        throw new Error('Not Authenticated')
      }

      if (stars < 0 || stars > 5) {
        throw new Error('Stars must be between 0 and 5')
      }

      const product = await Product.findByPk(productId)
      if (!product) {
        throw new Error('Product not found')
      }

      const existingReview = await Review.findOne({
        where: { userId: currentUser.id, productId}
      })

      if (existingReview) {
        throw new Error('You have already reviewed this product')
      }

      const newReview = await Review.create({
        userId: currentUser.id,
        productId,
        review,
        stars
      })

      const totalStars = product.averageRating * product.reviewCount + stars
      const newReviewCount = product.reviewCount + 1
      const newAverageRating = totalStars / newReviewCount

      await product.update({
        averageRating: newAverageRating,
        reviewCount: newReviewCount
      })

      return newReview

    }
  },
};

module.exports = resolvers;
