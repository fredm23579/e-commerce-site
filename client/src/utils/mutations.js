// src/utils/mutations.js
import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        email
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
    addUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
      token
      user {
        _id
        email
      }
    }
  }
`;

export const ADD_ORDER = gql`
  mutation addOrder($products: [ID]!) {
    addOrder(products: $products) {
      _id
      purchaseDate
      products {
        _id
        name
        description
        price
        quantity
        image
        category {
          name
        }
      }
    }
  }
`;

export const CREATE_CHECKOUT_SESSION = gql`
  mutation createCheckoutSession($products: [CreateCheckoutSessionInput!]!) {
    createCheckoutSession(products: $products) {
      session
      order
    }
  }
`;

export const ADD_TO_WISHLIST = gql`
  mutation addToWishlist($productId: ID!) {
    addToWishlist(productId: $productId) {
      _id
      wishlist {
        _id
        name
        description
        price
        quantity
        image
      }
    }
  }
`;

export const REMOVE_FROM_WISHLIST = gql`
  mutation removeFromWishlist($productId: ID!) {
    removeFromWishlist(productId: $productId) {
      _id
      wishlist {
        _id
        name
        description
        price
        quantity
        image
      }
    }
  }
`;
