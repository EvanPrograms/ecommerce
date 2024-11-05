// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const productsRouter = require('./routes/productRoutes')
const cartRouter = require('./routes/cartRoutes')
const usersRouter = require('./routes/userRoutes')
const loginRouter = require('./routes/loginRoutes')
const { connectToDatabase } = require('./config/db')
const { ApolloServer } = require('apollo-server-express')
const typeDefs = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')

const server = new ApolloServer({ typeDefs, resolvers })
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());


app.use('/api/products', productsRouter)
app.use('/api/cart', cartRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)



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
