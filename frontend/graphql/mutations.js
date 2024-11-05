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
      value
    }  
  }
`;
