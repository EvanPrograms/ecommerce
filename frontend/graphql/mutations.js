// graphql/mutations.js
import { gql } from '@apollo/client';

export const GET_USER = gql`
  query GetUser {
    me {
      id
      email
      name
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      id
      name
      image
      description
      price
      totalQuantityOrdered
      averageRating
      reviewCount
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($productId: ID!) {
    getProduct(productId: $productId) {
    id
    name
    image
    description
    price
    totalQuantityOrdered
    }
  }
`;

export const GET_USER_CART = gql`
  query GetUserCart($userId: ID!) {
    getUserCart(userId: $userId) {
      id
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
`;

export const CREATE_USER = gql`
  mutation CreateUser($email: String!, $name: String!, $password: String!) {
    createUser(email: $email, name: $name, password: $password) {
      id
      email
      name
      createdAt
      updatedAt
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        email
        name
      }
      token
    }  
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($userId: ID!, $token: String!, $newPassword: String!) {
    resetPassword(userId: $userId, token: $token, newPassword: $newPassword)
  }
`;

export const CREATE_CHECKOUT_SESSION = gql`
  mutation CreateCheckoutSession($cartItems: [StripeCartItemInput!]!) {
    createCheckoutSession(cartItems: $cartItems) {
    url
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
  clearCart
  }
`;

export const VALIDATE_SUCCESS = gql`
  mutation ValidateSuccess($randomValue: String!) {
    validateSuccess(randomValue: $randomValue) {
    success
    }
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview($productId: ID!, $review: String!, $stars: Int!) {
    createReview(productId: $productId, review: $review, stars: $stars) {
      id
      userId
      productId
      review
      stars
      createdAt
      updatedAt
    }
  }
`;

export const ORDER_HISTORY = gql`
  query GetOrderHIstory {
    getOrderHistory {
      id
      userId
      items {
        productId
        quantity
        price
        name
        hasLeftReview
      }
      totalPrice
      shippingAddress {
        line1
        line2
        city
        state
        postal_code
        country
      }
      orderDate
      sessionId
    }
  }
`;

// export const GET_USER_CART = gql`
//   query GetUserCart($userId: ID!) {
//     getUserCart(userId: $userId) {
//       id
//       productId
//       quantity
//     }
//   }
// `;