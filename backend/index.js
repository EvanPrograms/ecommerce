require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
});

const express = require('express');
const cors = require('cors');
const stripeRouter = require('./routes/stripeRoutes');
const { connectToDatabase } = require('./config/db');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');


const JWT_SECRET = process.env.JWT_SECRET;

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
});
const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.use('/api/webhook', bodyParser.raw({ type: 'application/json' }));

app.use(express.json());
const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, 
}));

app.use('/api/webhook', stripeRouter);

const startServer = async () => {
  await connectToDatabase()

  await server.start()
  server.applyMiddleware({ app, path: process.env.GRAPHQL_PATH || '/graphql' });

  app.listen(PORT, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
    console.log(`GraphQL endpoint: http://${HOST}:${PORT}${server.graphqlPath}`);  })
}

startServer().catch((error) => {
  console.error('Error starting server:', error)
})
