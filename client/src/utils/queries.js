// client/src/utils/queries.js
import { gql } from '@apollo/client';

export const QUERY_PRODUCTS = gql`
  query getProducts($category: ID, $name: String) {  
    products(category: $category, name: $name) {  
      _id
      name
      description
      price
      quantity
      image
      category {
        _id
        name
        urlSlug            
      }
    }
  }
`;

export const QUERY_ALL_PRODUCTS = gql`
  query getAllProducts {  
    products {
      _id
      name
      description
      price
      quantity
      image
      category {
        _id
        name
        urlSlug 
      }
    }
  }
`;

export const QUERY_CATEGORIES = gql`
  {
    categories {
      _id
      name
      urlSlug
    }
  }
`;

export const QUERY_USER = gql`
  {
    user {
      firstName
      lastName
      orders {
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
            _id
            name
            urlSlug
          }
        }
      }
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

export const QUERY_WISHLIST = gql`
  query getWishlistItems {
    user {
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

export const QUERY_FAVORITES = gql`
  {
    favorites {
      _id
      name
      description
      price
      quantity
      image
    }
  }
`;
