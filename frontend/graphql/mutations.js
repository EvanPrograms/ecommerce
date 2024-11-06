// graphql/mutations.js
import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GetUser {
  me {
    id
    username
    name
    }
  }
`;

export const GET_PRODUCTS = gql`
  query  GetProducts {
    getProducts {
      id
      name
      image
      description
      price
    }
  }
`;

export const GET_USER_CART = gql`
  query GetUserCart($userId: ID!) {
  getUserCart(userId: $userId) {
    productId
    quantity
    }
  }
`;

export const UPDATE_USER_CART = gql`
  mutation UpdateUserCart($userId: ID!, $cart: [CartItemInput!]!) {
    updateUserCart(userId: $userId, cart: $cart) {
      message
      errors {
        field
        message
      }
    }
  }  
`

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $name: String!, $password: String!) {
    createUser(username: $username, name: $name, password: $password) {
      id
      username
      name
      createdAt
      updatedAt
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        id
        username
        name
      }
      token
    }  
  }
`;
