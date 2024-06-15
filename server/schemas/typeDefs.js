// server/schemas/typeDefs.js
import { gql } from 'apollo-server-express';

const typeDefs = gql`
  # Scalar Type for Dates
  scalar Date

  # Category Type
  type Category {
    _id: ID!
    name: String!
    urlSlug: String! 
  }

  # Product Type
  type Product {
    _id: ID!
    name: String!
    description: String
    image: String
    quantity: Int!
    price: Float!
    category: Category!
  }

  # OrderItem Type
  type OrderItem {
    product: Product!
    quantity: Int!
    price: Float!
  }

  # Order Type
  type Order {
    _id: ID!
    purchaseDate: Date!
    products: [OrderItem!]!
    total: Float!         
    status: String!      
    shippingAddress: ShippingAddress
  }

  type ShippingAddress {
    street: String!
    city: String!
    state: String!
    postalCode: String!
    country: String!
  }

  # User Type
  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    orders: [Order!]!
    wishlist: [Product!]!
  }

  # Checkout Session Type
  type Checkout {
    session: ID!
    order: ID!
  }

  # Auth Type
  type Auth {
    token: String!
    user: User!
  }

  # Input Types
  input ProductInput {
    _id: ID!
    purchaseQuantity: Int!
  }

  input CategoryInput {  
    name: String!
    description: String
  }

  input ShippingAddressInput {
    street: String!
    city: String!
    state: String!
    postalCode: String!
    country: String!
  }

  # Query Definitions
  type Query {
    categories: [Category!]!
    products(category: ID, name: String): [Product!]!
    product(_id: ID!): Product
    user: User
    order(_id: ID!): Order
  }

  # Mutation Definitions (updated)
  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth!
    addOrder(products: [ProductInput!]!): Order!
    updateUser(firstName: String, lastName: String, email: String, password: String): User
    updateProduct(_id: ID!, quantity: Int!): Product
    login(email: String!, password: String!): Auth!
    addToWishlist(productId: ID!): User!
    removeFromWishlist(productId: ID!): User!
    addCategory(input: CategoryInput!): Category!  # addCategory mutation
    updateCategory(_id: ID!, input: CategoryInput!): Category! # updateCategory mutation
    removeCategory(_id: ID!): Category!   # removeCategory mutation
    addProduct(input: ProductInput!): Product!   # addProduct mutation
    updateProduct(_id: ID!, input: ProductInput!): Product! # updateProduct mutation
    removeProduct(_id: ID!): Product! # removeProduct mutation
    checkout(products: [ID!]!, shippingAddress: ShippingAddressInput!): Checkout
  }
`;

export default typeDefs;
