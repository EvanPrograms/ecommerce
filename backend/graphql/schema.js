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
    totalQuantityOrdered: Int!
    averageRating: Float
    reviewCount: Int
  }

  type CartItem {
      id: ID!
      productId: ID!
      quantity: Int!
  }

  input CartItemInput { 
    productId: ID!
    quantity: Int!,
    guestSessionId: String
  }

  input StripeCartItemInput {
    productId: ID!
    name: String!
    price: Int!
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
    getProduct(productId: ID!): [Product]
    me: User
    getOrderHistory: [Order!]!
    getReviews(productId: ID!): [Review!]!
  }

  type CartUpdateResponse {
    message: String!
    errors: [FieldError!]
  }

  type FieldError {
    field: String!
    message: String!
  }

  type CheckoutSessionResponse {
    url: String!
  }

  type ValidateSuccessResponse {
    success: Boolean!
    userType: String!
  }

  type Review {
    id: ID!
    userId: ID!
    productId: ID!
    review: String!
    stars: Int!
    createdAt: String
    updatedAt: String
  }

  type OrderItem {
    productId: ID!
    quantity: Int!
    price: Int!
    name: String!
    hasLeftReview: Boolean!
  }

  type Order {
    id: ID!
    userId: ID!
    items: [OrderItem!]!
    totalPrice: Int!
    shippingAddress: Address!
    orderDate: String!
    sessionId: String!
  }

  type Address {
    line1: String!
    line2: String
    city: String!
    state: String!
    postal_code: String!
    country: String!
  }

  type Mutation {
    createUser(email: String!, name: String!, password: String!): User!
    login(email: String!, password: String!): AuthPayload!
    updateUserCart(userId: ID!, guestSessionId: String, cart: [CartItemInput!]!) : CartUpdateResponse!
    requestPasswordReset(email: String!) : Boolean!
    resetPassword(userId: ID!, token: String!, newPassword: String!): Boolean!
    createCheckoutSession(cartItems: [StripeCartItemInput!]!): CheckoutSessionResponse!
    clearCart: Boolean!
    validateSuccess(randomValue: String!): ValidateSuccessResponse!
    createReview(productId: ID!, review: String!, stars: Int!): Review!
  }
`;

module.exports = typeDefs;
