// server/models/index.js
import User from './User.js'; // Ensure .js extension when using ES Modules
import Product from './Product.js';
import Category from './Category.js';
import Order from './Order.js';

export { User, Product, Category, Order }; 

export { default as User } from './User.js';
export { default as Product } from './Product.js';
export { default as Category } from './Category.js';
export { default as Order } from './Order.js';