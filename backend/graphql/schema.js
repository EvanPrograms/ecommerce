const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    createdAt: String
    updatedAt: String
  } 
  
  type Product {
  id: ID!
  name: String!
  image: String!
  description: String!
  price: Int!
  }

  type CartItem {
      productId: ID!
      quantity: Int!
  }

  input CartItemInput { 
    productId: ID!
    quantity: Int!
  }

  type Token {
    value: String!  
  }

  type AuthPayload {
  user: User!
  token: String!
  }

  type Query {
    users: [User!]!
    getUserCart(userId: ID!): [CartItem]
    getProducts: [Product]
    me: User
  }

  type CartUpdateResponse {
  message: String!
  errors: [FieldError!]
  }

  type FieldError {
  field: String!
  message: String!
  }

  type Mutation {
    createUser(email: String!, name: String!, password: String!): User!
    login(email: String!, password: String!): AuthPayload!
    updateUserCart(userId: ID!, cart: [CartItemInput!]!) : CartUpdateResponse!
    requestPasswordReset(email: String!) : Boolean!
    resetPassword(userId: ID!, token: String!, newPassword: String!): Boolean!
  }
`;

module.exports = typeDefs;
