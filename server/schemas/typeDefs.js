import { gql } from 'apollo-server-express';

const typeDefs = gql`
  scalar Date

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

  type OrderItem {
    product: Product!
    quantity: Int!
    price: Float!
  }

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

  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    orders: [Order!]!
    wishlist: [Product!]!
  }

  type Checkout {
    session: ID!
    order: ID!
  }

  type Auth {
    token: String!
    user: User!
  }

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

  type Query {
    categories: [Category!]!
    products(category: ID, name: String): [Product!]!
    product(_id: ID!): Product
    user: User
    order(_id: ID!): Order
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth!
    addOrder(products: [ProductInput!]!): Order!
    updateUser(firstName: String, lastName: String, email: String, password: String): User
    updateProduct(_id: ID!, input: ProductInput!): Product
    login(email: String!, password: String!): Auth!
    addToWishlist(productId: ID!): User!
    removeFromWishlist(productId: ID!): User!
    addCategory(input: CategoryInput!): Category!
    updateCategory(_id: ID!, input: CategoryInput!): Category!
    removeCategory(_id: ID!): Category!
    addProduct(input: ProductInput!): Product!
    removeProduct(_id: ID!): Product!
    checkout(products: [ID!]!, shippingAddress: ShippingAddressInput!): Checkout
  }
`;

export default typeDefs;
