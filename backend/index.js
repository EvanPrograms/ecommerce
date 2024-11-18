// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/productRoutes')
const cartRouter = require('./routes/cartRoutes')
const usersRouter = require('./routes/userRoutes')
const loginRouter = require('./routes/loginRoutes')
const stripeRouter = require('./routes/stripeRoutes')
const { connectToDatabase } = require('./config/db')
const { ApolloServer } = require('apollo-server-express')
const typeDefs = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const server = new ApolloServer({ 
  typeDefs, 
  resolvers, 
  context: async ({ req }) => {
  const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith('Bearer ')) {
      try {
        const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
        const currentUser = await User.findByPk(decodedToken.id)
        return { currentUser };
      } catch (error) {
        console.error('Token verification error:', error);
      }
    }
  } 
})
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());


// app.use('/api/products', productsRouter)
// app.use('/api/cart', cartRouter)
// app.use('/api/users', usersRouter)
// app.use('/api/login', loginRouter)
// app.use('/api/checkout', stripeRouter)



const startServer = async () => {
  await connectToDatabase()

  await server.start()
  server.applyMiddleware({ app, path: '/graphql' })

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`)
  })
}

startServer().catch((error) => {
  console.error('Error starting server:', error)
})
