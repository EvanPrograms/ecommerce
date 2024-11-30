// index.js
require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
});
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
        console.error('Token verification error:', error);
      }
    }
  } 
})
const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.use('/api/webhook', bodyParser.raw({ type: 'application/json' }));

// Middleware
app.use(express.json());
const allowedOrigins = [
  'http://localhost:5173', 
  `http://${process.env.HOST}`,
  `https://${process.env.HOST}`,
  'http://passionchocolates.com',
  'http://www.passionchocolates.com',
  'https://passionchocolates.com', // You can add this once you enable HTTPS
  'https://www.passionchocolates.com'
];
// Set up CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    console.log(`Incoming origin: ${origin}`);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`Blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Stripe webhook routes
app.use('/api/webhook', stripeRouter);

const startServer = async () => {
  await connectToDatabase()

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
      console.log(`Server running on https://${HOST}:${PORT}`);
      console.log(`GraphQL endpoint: https://${HOST}:${PORT}${server.graphqlPath}`);
    });
  } else {
    // Development: Use HTTP
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
      console.log(`GraphQL endpoint: http://${HOST}:${PORT}${server.graphqlPath}`);
    });
  }
};

startServer().catch((error) => {
  console.error('Error starting server:', error)
})
