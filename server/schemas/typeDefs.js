import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Category {
    _id: ID!
    name: String!
    urlSlug: String!  # Add urlSlug to the Category type
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

  type Order {
    _id: ID!
    purchaseDate: String!  # String is likely a better representation for dates
    products: [Product!]!   
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
    order: ID!  # Add order ID to the Checkout type
  }

  type Auth {
    token: String! 
    user: User!
  }

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
    addOrder(products: [ProductInput!]!): Order!  # Use ProductInput for type safety
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
