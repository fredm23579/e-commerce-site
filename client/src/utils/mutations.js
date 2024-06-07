import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_ORDER = gql`
  mutation addOrder($products: [ID]!) {
    addOrder(products: $products) {
      purchaseDate
      products {
        _id
        name
        description
        price
        quantity
        category {
          name
        }
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    addUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      token
      user {
        _id
      }
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
        image
        quantity
        price
        category {
          name
        }
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
        image
        quantity
        price
        category {
          name
        }
      }
    }
  }
`;

export const ADD_TO_FAVORITES = gql`
  mutation addToFavorites($productId: ID!) {
    addToFavorites(productId: $productId) {
      _id
      favorites {
        _id
        name
        description
        image
        quantity
        price
        category {
          name
        }
      }
    }
  }
`;

export const REMOVE_FROM_FAVORITES = gql`
  mutation removeFromFavorites($productId: ID!) {
    removeFromFavorites($productId: $productId) {
      _id
      favorites {
        _id
        name
        description
        image
        quantity
        price
        category {
          name
        }
      }
    }
  }
`;
