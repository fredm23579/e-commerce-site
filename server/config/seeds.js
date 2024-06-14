//import mongoose from 'mongoose'; // Import mongoose for database interaction
import db from './connection.js'; // Import the database connection from connection.js
import { User, Product, Category } from '../models'; // Import your Mongoose models
import cleanDB from './cleanDB.js'; // Import your custom cleanDB function
// server/config/seeds.js
import User from '../models/User.js'; // Add the .js extension
import Product from '../models/Product.js';
import Category from '../models/Category.js';
//import Order from '../models/Order.js';

db.once('open', async () => {
  await cleanDB('Category', 'categories');
  await cleanDB('Product', 'products');
  await cleanDB('User', 'users');

  const categories = await Category.insertMany([
    { name: 'Food' },
    { name: 'Household Supplies' },
    { name: 'Electronics' },
    { name: 'Books' },
    { name: 'Toys' },
    { name: 'Laboratory Equipment & Supplies' },
    { name: 'Astronomy' },
    { name: 'Biology & Life Sciences' },
    { name: 'Chemistry' },
    { name: 'Energy' },
    { name: 'Geology' },
    { name: 'Physics & Engineering' },
    { name: 'Environmental & Earth Sciences' },
    { name: 'Educational Resources' }
  ]);

  console.log('categories seeded');

  const products = await Product.insertMany([
    {
      name: 'Digital Multimeter',
      description:
        'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      image: 'multimeter.jpg',
      category: categories[5]._id,
      price: 2.99,
      quantity: 500
    },
    {
      name: 'Canned Coffee',
      description:
        'Praesent sed lacinia mauris. Nulla congue nibh magna, at feugiat nunc scelerisque quis. Donec iaculis rutrum vulputate. Suspendisse lectus sem, vulputate ac lectus sed, placerat consequat dui.',
      image: 'canned-coffee.jpg',
      category: categories[0]._id,
      price: 1.99,
      quantity: 500
    },
    {
      name: 'Toilet Paper',
      category: categories[1]._id,
      description:
        'Donec volutpat erat erat, sit amet gravida justo sodales in. Phasellus tempus euismod urna. Proin ultrices nisi ut ipsum congue, vitae porttitor libero suscipit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam lacinia a nisi non congue.',
      image: 'toilet-paper.jpg',
      price: 7.99,
      quantity: 20
    },
    {
      name: 'Handmade Soap',
      category: categories[1]._id,
      description:
        'Praesent placerat, odio vel euismod venenatis, lectus arcu laoreet felis, et fringilla sapien turpis vestibulum nisl.',
      image: 'soap.jpg',
      price: 3.99,
      quantity: 50
    },
    {
      name: 'Set of Wooden Spoons',
      category: categories[1]._id,
      description:
        'Vivamus ut turpis in purus pretium mollis. Donec turpis odio, semper vel interdum ut, vulputate at ex. Duis dignissim nisi vel tortor imperdiet finibus. Aenean aliquam sagittis rutrum.',
      image: 'wooden-spoons.jpg',
      price: 14.99,
      quantity: 100
    },
    {
      name: 'Camera',
      category: categories[2]._id,
      description:
        'Vestibulum risus metus, luctus non tortor quis, tincidunt consectetur ex. Nullam vitae lobortis ligula, ut sagittis massa. Curabitur consectetur, tellus at pulvinar venenatis, erat augue cursus erat, eu ullamcorper eros lectus ultrices ipsum. Integer rutrum, augue vitae auctor venenatis, turpis turpis elementum orci, at sagittis risus mi a leo.',
      image: 'camera.jpg',
      price: 399.99,
      quantity: 30
    },
    {
      name: 'Tablet',
      category: categories[2]._id,
      description:
        'In sodales, ipsum quis ultricies porttitor, tellus urna aliquam arcu, eget venenatis purus ligula ut nisi. Fusce ut felis dolor. Mauris justo ante, aliquet non tempus in, tempus ac lorem. Aliquam lacinia dolor eu sem eleifend ultrices. Etiam mattis metus metus. Sed ligula dui, placerat non turpis vitae, suscipit volutpat elit. Phasellus sagittis, diam elementum suscipit fringilla, libero mauris scelerisque ex, ac interdum diam erat non sapien.',
      image: 'tablet.jpg',
      price: 199.99,
      quantity: 30
    },
    {
      name: 'Tales at Bedtime',
      category: categories[3]._id,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ornare diam quis eleifend rutrum. Aliquam nulla est, volutpat non enim nec, pharetra gravida augue. Donec vitae dictum neque. Pellentesque arcu lorem, fringilla non ligula ac, tristique bibendum erat. Ut a semper nibh. Quisque a mi et mi tempor ultricies. Maecenas eu ipsum eu enim hendrerit accumsan at euismod urna.',
      image: 'bedtime-book.jpg',
      price: 9.99,
      quantity: 100
    },
    {
      name: 'Spinning Top',
      category: categories[4]._id,
      description: 'Ut vulputate hendrerit nibh, a placerat elit cursus interdum.',
      image: 'spinning-top.jpg',
      price: 1.99,
      quantity: 1000
    },
    {
      name: 'Set of Plastic Horses',
      category: categories[4]._id,
      description:
        'Sed a mauris condimentum, elementum enim in, rhoncus dui. Phasellus lobortis leo odio, sit amet pharetra turpis porta quis.',
      image: 'plastic-horses.jpg',
      price: 2.99,
      quantity: 1000
    },
    {
      name: 'Teddy Bear',
      category: categories[4]._id,
      description:
        'Vestibulum et erat finibus erat suscipit vulputate sed vitae dui. Ut laoreet tellus sit amet justo bibendum ultrices. Donec vitae felis vestibulum, congue augue eu, finibus turpis.',
      image: 'teddy-bear.jpg',
      price: 7.99,
      quantity: 100
    },
    {
      name: 'Alphabet Blocks',
      category: categories[4]._id,
      description:
        'Morbi consectetur viverra urna, eu fringilla turpis faucibus sit amet. Suspendisse potenti. Donec at dui ac sapien eleifend hendrerit vel sit amet lectus.',
      image: 'alphabet-blocks.jpg',
      price: 9.99,
      quantity: 600
    },
    {
      name: 'Telescope',
      description:
        'Advanced telescope with high-resolution optics for astronomy enthusiasts.',
      image: 'telescope.jpg',
      category: categories[6]._id,
      price: 299.99,
      quantity: 50
    },
    {
      name: 'Microscope',
      description:
        'High-quality microscope suitable for biology and life sciences.',
      image: 'microscope.jpg',
      category: categories[7]._id,
      price: 199.99,
      quantity: 30
    },
    {
      name: 'Chemical Reagents Set',
      description:
        'A complete set of chemical reagents for educational and research purposes.',
      image: 'reagents.jpg',
      category: categories[8]._id,
      price: 79.99,
      quantity: 200
    },
    {
      name: 'Solar Panel Kit',
      description:
        'Efficient solar panel kit for energy experiments and projects.',
      image: 'solarkit.jpg',
      category: categories[9]._id,
      price: 499.99,
      quantity: 15
    },
    {
      name: 'Rock Collection Kit',
      description:
        'Comprehensive rock collection kit for geology enthusiasts.',
      image: 'rock-kit-lg.jpg',
      category: categories[10]._id,
      price: 29.99,
      quantity: 100
    },
    {
      name: 'Physics Experiment Kit',
      description:
        'A versatile kit for various physics experiments and demonstrations.',
      image: 'physicslabkit.jpg',
      category: categories[11]._id,
      price: 99.99,
      quantity: 75
    },
    {
      name: 'Environmental Science Kit',
      description:
        'An engaging kit for environmental and earth sciences studies.',
      image: 'environmentalsciencekit.jpg',
      category: categories[12]._id,
      price: 59.99,
      quantity: 120
    },
    {
      name: 'Educational Posters',
      description:
        'Set of educational posters covering various scientific topics.',
      image: 'scienceposter.jpg',
      category: categories[13]._id,
      price: 19.99,
      quantity: 300
    }
  ]);

  console.log('products seeded');

  await User.create({
    firstName: 'Jeff',
    lastName: 'Bezzoss',
    email: 'Jeff@testmail.com',
    password: 'password12345',
    orders: [
      {
        products: [products[0]._id, products[0]._id, products[1]._id]
      }
    ]
  });

  await User.create({
    firstName: 'Bob',
    lastName: 'Holt',
    email: 'bholt@testmail.com',
    password: 'password12345'
  });

  console.log('users seeded');

  process.exit();
});
