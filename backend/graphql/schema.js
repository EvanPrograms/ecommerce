const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    name: String!
    createdAt: String
    updatedAt: String
  }

  type Query {
    users: [User!]!
  }

  type Token {
    value: String!  
  }

  type Mutation {
    createUser(username: String!, name: String!, password: String!): User!
    login(username: String!, password: String!): Token
  }
`;

module.exports = typeDefs;
