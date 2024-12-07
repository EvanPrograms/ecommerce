// index.js
require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
});
const logger = require('./logger')
const fs = require('fs');
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
const bodyParser = require('body-parser')


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
        logger.error('Token verification error: ' + error.message);
      }
    }
  } 
})
const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.originalUrl}`); // Log HTTP requests
  next();
});

app.use('/api/webhook', bodyParser.raw({ type: 'application/json' }));

// Middleware
app.use(express.json());
const allowedOrigins = [
  'http://localhost:5173', 
   process.env.HOST,
  'http://passionchocolates.com',
  'http://www.passionchocolates.com',
  'https://passionchocolates.com', // You can add this once you enable HTTPS
  'https://www.passionchocolates.com'
];
// Set up CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    // console.log(`Incoming origin: ${origin}`);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`Blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Stripe webhook routes
app.use('/api/webhook', stripeRouter);

const startServer = async () => {
  await connectToDatabase()
  logger.info('Connected to the database');

  await server.start()
  server.applyMiddleware({ app, path: process.env.GRAPHQL_PATH || '/graphql' });

  if (process.env.NODE_ENV === 'production') {
    // Production: Use HTTPS
    const sslOptions = {
      key: fs.readFileSync('/etc/letsencrypt/live/passionchocolates.com/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/passionchocolates.com/fullchain.pem'),
    };
    const https = require('https');
    https.createServer(sslOptions, app).listen(PORT, '0.0.0.0', () => {
      logger.info(`Server running on ${HOST}:${PORT}`);
      logger.info(`GraphQL endpoint: ${HOST}:${PORT}${server.graphqlPath}`)
    });
  } else {
    // Development: Use HTTP
    app.listen(PORT, '0.0.0.0', () => {
        logger.info(`Server running on ${HOST}:${PORT}`);
        logger.info(`GraphQL endpoint: ${HOST}:${PORT}${server.graphqlPath}`);
    });
  }
};

startServer().catch((error) => {
  logger.error('Error in server start: ' + error.message);
})
