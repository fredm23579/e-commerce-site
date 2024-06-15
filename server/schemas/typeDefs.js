// server/schemas/typeDefs.js
import { gql } from 'apollo-server-express';

const typeDefs = gql`
  # Category Type (Updated)
  type Category {
    _id: ID!
    name: String!
    urlSlug: String! 
  }

  type Product {
    _id: ID!
    name: String!
    description: String
    image: String
    quantity: Int!
    price: Float!
    category: Category!
  }

  # Order Type (Updated)
  type Order {
    _id: ID!
    purchaseDate: String!
    products: [Product!]!
    total: Float!         # Added field for the total cost of the order
    status: String!      # Added field to track order status
    shippingAddress: ShippingAddress # Added field for shipping address
  }

  type ShippingAddress {  # New type for shipping address
    street: String!
    city: String!
    state: String!
    postalCode: String!
    country: String!
  }

  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    orders: [Order!]!
    wishlist: [Product!]!
    favorites: [Product!]!
  }

  type Checkout {
    session: ID!
    order: ID!
  }

  type Auth {
    token: String!
    user: User!
  }

  # ProductInput (Updated)
  input ProductInput {
    _id: ID!
    purchaseQuantity: Int!
  }

  type Query {
    categories: [Category!]!
    products(category: ID, name: String): [Product!]!
    product(_id: ID!): Product
    user: User
    order(_id: ID!): Order
    checkout(products: [ProductInput!]!): Checkout
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth!
    addOrder(products: [ProductInput!]!): Order!
    updateUser(firstName: String, lastName: String, email: String, password: String): User
    updateProduct(_id: ID!, quantity: Int!): Product
    login(email: String!, password: String!): Auth!
    addToWishlist(productId: ID!): User!
    removeFromWishlist(productId: ID!): User!
    addToFavorites(productId: ID!): User!
    removeFromFavorites(productId: ID!): User!
  }
`;

export default typeDefs;
