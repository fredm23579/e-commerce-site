
  <div align="center">
  <h1 align="center">E Commerce Website</h1>
  <h3>Codebase for the E Commerce Website platform</h3>
  <h3>◦ Developed with the software and tools below.</h3>
  <p align="center"><img src="https://img.shields.io/badge/-Node.js-004E89?logo=Node.js&style=for-the-badge" alt='Node.js\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-Express.js-004E89?logo=Express.js&style=for-the-badge" alt='Express.js\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-MongoDB-004E89?logo=MongoDB&style=for-the-badge" alt='MongoDB\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-GraphQL-004E89?logo=GraphQL&style=for-the-badge" alt='GraphQL\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-React-004E89?logo=React&style=for-the-badge" alt='React\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-Apollo%20Client-004E89?logo=Apollo%20Client&style=for-the-badge" alt='Apollo Client"' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" />
  </p>
  </div>
  
  ---
  ## 📚 Table of Contents
  - [📚 Table of Contents](#-table-of-contents)
  - [🔍 Overview](#-overview)
  - [🌟 Features](#-features)
  - [📁 Repository Structure](#-repository-structure)
  - [💻 Code Summary](#-code-summary)
  - [🚀 Getting Started](#-getting-started)
  
  ---
  
  
  ## 🔍 Overview

 This is a full-stack JavaScript project with a client and server directory. The client directory contains the frontend code, while the server directory contains the backend code. The project uses Vite for the client-side build tool and MongoDB for the database. The project also includes a GraphQL API using Apollo Server. The client-side code is written in React, while the server-side code is written in Node.js. The project includes a variety of files and directories, including configuration files, source code, and test files.

---

## 🌟 Features

 Here is a list of features of the project:<br>
* Full-stack JavaScript project with client and server directories
* Client-side code written in React
* Server-side code written in Node.js
* Uses Vite for client-side build tool and MongoDB for database
* Includes GraphQL API using Apollo Server
* Variety of files and directories, including configuration files, source code, and test files

---

## 📁 Repository Structure

```sh
├── .gitignore
├── client
│   ├── .eslintrc.cjs
│   ├── .gitignore
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── components
│   │   │   ├── Cart
│   │   │   │   ├── index.jsx
│   │   │   │   └── style.css
│   │   │   ├── CartItem
│   │   │   │   └── index.jsx
│   │   │   ├── CategoryMenu
│   │   │   │   └── index.jsx
│   │   │   ├── DeleteBtn
│   │   │   │   └── index.jsx
│   │   │   ├── Favorites
│   │   │   │   └── index.jsx
│   │   │   ├── Jumbotron
│   │   │   │   └── index.jsx
│   │   │   ├── Nav
│   │   │   │   └── index.jsx
│   │   │   ├── ProductItem
│   │   │   │   └── index.jsx
│   │   │   ├── ProductList
│   │   │   │   └── index.jsx
│   │   │   └── Wishlist
│   │   │       └── index.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── Detail.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NoMatch.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Success.jsx
│   │   │   └── Wishlist.jsx
│   │   └── utils
│   │       ├── actions.js
│   │       ├── auth.js
│   │       ├── GlobalState.jsx
│   │       ├── helpers.js
│   │       ├── mutations.js
│   │       ├── queries.js
│   │       └── reducers.js
│   └── vite.config.js
├── LICENSE
├── package-lock.json
├── package.json
├── README.md
└── server
    ├── .gitignore
    ├── models
    │   ├── Category.js
    │   ├── index.js
    │   ├── Order.js
    │   ├── Product.js
    │   └── User.js
    ├── package-lock.json
    ├── package.json
    ├── schemas
    │   ├── index.js
    │   ├── resolvers.js
    │   └── typeDefs.js
    ├── server.js
    └── utils
        └── auth.js

```

---

## 💻 Code Summary

<details><summary>\client\src</summary>

| File | Summary |
| ---- | ------- |
| App.jsx |  The code defines a React application that uses Apollo Client to manage GraphQL requests and provides a client-side cache for the data. It also includes a provider component for a global state management system, as well as components for various pages in the application, such as the home page, login, signup, order history, wishlist, favorites, and success pages. |
| main.jsx |  The code sets up an Apollo Client for a React application, with a BrowserRouter and an InMemoryCache, and renders the App component within an ApolloProvider. |

</details>

---

<details><summary>\client\src\components\Cart</summary>

| File | Summary |
| ---- | ------- |
| index.jsx |  The primary function of this code is to display a shopping cart component that allows users to view and manage their items in a virtual cart. It also includes functionality for checking out and redirecting the user to a payment processing page using Stripe. |

</details>

---

<details><summary>\client\src\components\CartItem</summary>

| File | Summary |
| ---- | ------- |
| index.jsx |  The CartItem component renders a single item in the shopping cart, allowing the user to update the quantity or remove the item from the cart. |

</details>

---

<details><summary>\client\src\components\CategoryMenu</summary>

| File | Summary |
| ---- | ------- |
| index.jsx |  The code defines a React component called CategoryMenu, which fetches categories from an API using Apollo Client and updates the state with the received data. It also handles the click event of each category button and updates the current category in the state. |

</details>

---

<details><summary>\client\src\components\DeleteBtn</summary>

| File | Summary |
| ---- | ------- |
| index.jsx |  The DeleteBtn component is a custom button element that spreads all passed props onto the element and adds a role=button and tabIndex=0 attribute to make it accessible. |

</details>

---

<details><summary>\client\src\components\Favorites</summary>

| File | Summary |
| ---- | ------- |
| index.jsx |  The code in the provided file defines a React component called Favorites that displays a list of items stored in the user's favorites. The component uses the GlobalState hook to access the state and dispatch actions, and it also imports the REMOVE_FROM_FAVORITES action type and the idbPromise function from other modules. When a user clicks the Remove from Favorites button for an item, the removeFromFavorites function is called, which dispatches the REMOVE_FROM_FAVORITES action and deletes the item from the user's favorites in IndexedDB. |

</details>

---

<details><summary>\client\src\components\Jumbotron</summary>

| File | Summary |
| ---- | ------- |
| index.jsx |  The code defines a React component called Jumbotron that renders a div element with a specific style and allows for the inclusion of child components. |

</details>

---

<details><summary>\client\src\components\Nav</summary>

| File | Summary |
| ---- | ------- |
| index.jsx |  The code in the provided file defines a functional component called `Nav` that renders a header with a logo and navigation links. The component uses the `Auth` utility to determine whether to show login or logout links based on the user's authentication status. |

</details>

---

<details><summary>\client\src\components\ProductItem</summary>

| File | Summary |
| ---- | ------- |
| index.jsx |  The code defines a React component called `ProductItem` that renders a product item with an image, name, price, and buttons to add the product to a cart, wishlist, or favorites. It also includes functionality for adding products to a local storage database using IndexedDB. |

</details>

---

<details><summary>\client\src\components\ProductList</summary>

| File | Summary |
| ---- | ------- |
| index.jsx |  The code defines a React component called `ProductList` that retrieves products from a GraphQL API and displays them in a list. It also includes a filter function to display only products from the current category. |

</details>

---

<details><summary>\client\src\components\Wishlist</summary>

| File | Summary |
| ---- | ------- |
| index.jsx |  The code in the provided file defines a React component called Wishlist that displays a list of items from the user's wishlist, along with buttons to remove items from the wishlist. |

</details>

---

<details><summary>\client\src\pages</summary>

| File | Summary |
| ---- | ------- |
| Detail.jsx |  The code defines a React component called `Detail` that retrieves product data from an API or IDB, displays the product details and allows the user to add or remove the product from the cart. |
| Favorites.jsx |  The code in the provided file defines a React component called Favorites that displays a list of items from the user's favorites, along with a button to remove each item from their favorites. |
| Home.jsx |  The code defines a React component called `Home` that renders a container with a category menu, product list, and cart. |
| Login.jsx |  The code defines a login form component in React, using the Apollo Client library for GraphQL mutations and the Auth module for authentication. The component handles form submission, updates state with user input, and displays an error message if the login credentials are incorrect. |
| NoMatch.jsx |  The code defines a React component called NoMatch that renders a 404 page not found message using the Jumbotron component. |
| OrderHistory.jsx |  The code defines a React component called OrderHistory that displays the order history for a user, fetched from a GraphQL API using Apollo Client's useQuery hook. |
| Signup.jsx |  The code defines a Signup component for a React application that allows users to create an account by providing their email, password, first name, and last name. The component uses the useState hook to manage the form state and the useMutation hook from Apollo Client to execute a GraphQL mutation to add the user to the database. The handleFormSubmit function is called when the form is submitted, which calls the addUser mutation with the form data and logs the user in after successful registration. |
| Success.jsx |  The code defines a React component called Success that displays a success message and redirects the user to the home page after 3 seconds. It uses the Apollo Client library to make a GraphQL mutation to add an order to the database, and it also uses the IndexedDB library to delete the items from the cart after they have been added to the order. |
| Wishlist.jsx |  The code in the provided file is a React component that retrieves and displays data from a GraphQL query, specifically the wishlist data. It also updates the state of the component with the retrieved data and handles any errors that may occur during the process. |

</details>

---

<details><summary>\client\src\utils</summary>

| File | Summary |
| ---- | ------- |
| actions.js |  The code defines a set of constants for action types used in a Redux store, including actions for updating products, adding and removing items from the cart, updating the cart quantity, and toggling the cart visibility. |
| auth.js |  The code defines a class called AuthService that provides methods for managing authentication tokens and checking if the user is logged in. |
| GlobalState.jsx |  The code defines a React context for managing global state, including products, cart, categories, and wishlist/favorites. |
| helpers.js |  The code defines two functions: `pluralize` and `idbPromise`. `pluralize` takes a word and a count as arguments and returns the word with an s added to it if the count is not 1. `idbPromise` creates a new promise that interacts with an IndexedDB database, allowing for CRUD (create, read, update, delete) operations on various stores in the database. |
| mutations.js |  The code defines GraphQL mutations for logging in, adding an order, adding a user, adding to a wishlist, removing from a wishlist, adding to favorites, and removing from favorites. |
| queries.js |  The code defines GraphQL queries for various purposes, including retrieving products, categories, user information, and wishlist and favorites. |
| reducers.js |  The code defines a reducer function that updates the state of a shopping cart and wishlist based on actions dispatched by the store. |

</details>

---

<details><summary>\client</summary>

| File | Summary |
| ---- | ------- |
| vite.config.js |  The code defines a Vite configuration file that sets up a development server with a React plugin, proxying requests to a GraphQL endpoint at port 3001, and enables testing with the happy-dom environment. |

</details>

---

<details><summary>\server\models</summary>

| File | Summary |
| ---- | ------- |
| Category.js |  The code defines a Category model in MongoDB using Mongoose, with a name field that is required and trimmed. |
| index.js |  The code exports four models (User, Product, Category, Order) from the current module. |
| Order.js |  The code defines a Mongoose schema for an Order model, with fields for purchase date and an array of product references. |
| Product.js |  The code defines a product schema for a MongoDB database using Mongoose, with fields for name, description, image, price, quantity, and category, and exports the model as Product. |
| User.js |  The code defines a User model in MongoDB using Mongoose, with fields for first name, last name, email, password, orders, wishlist, and favorites. It also defines a pre-save hook to hash the password and a method to compare passwords. |

</details>

---

<details><summary>\server\schemas</summary>

| File | Summary |
| ---- | ------- |
| index.js |  The code exports two objects, `typeDefs` and `resolvers`, from the current module. |
| resolvers.js |  The code defines a set of GraphQL resolvers for a e-commerce application, with the primary function of handling user authentication and authorization, as well as querying and mutating data in the application's database. |
| typeDefs.js |  The code defines a GraphQL schema for an e-commerce platform, with types for categories, products, orders, users, and checkout sessions, as well as input types and mutations for adding and updating data. |

</details>

---

<details><summary>\server</summary>

| File | Summary |
| ---- | ------- |
| server.js |  The code sets up an Express server with Apollo Server, a GraphQL server, and connects it to a MongoDB database. It also includes middleware for authentication and serves static files from the client directory. |

</details>

---

<details><summary>\server\utils</summary>

| File | Summary |
| ---- | ------- |
| auth.js |  The code defines a module that exports an authentication middleware function and a signToken function, which are used to authenticate users using JSON Web Tokens (JWTs) and sign new tokens with a secret key. |

</details>

---

## 🚀 Getting Started

 Getting Started with Online Store<br>=====================================

This guide will help you get started with the Online Store project. It covers the basic setup and configuration of the project, as well as some tips for working with the code.

1. Setting up the Project
---------------------------

To set up the project, follow these steps:

* Clone the repository from GitHub to your local machine.
* Install the dependencies by running `npm install` in both the client and server directories.
* Create a `.env` file in the root directory of the project and add your MongoDB connection string and Stripe API key.
* Run `npm run develop` to start the development server.

2. Understanding the Code Structure
----------------------------------

The Online Store project is structured as follows:

* The client directory contains the frontend code, written in React.
* The server directory contains the backend code, written in Node.js.
* The GraphQL API is implemented using Apollo Server.
* The database is MongoDB.

3. Tips for Working with the Code
---------------------------------

Here are some tips for working with the code:

* Use the `npm run watch` command in the server directory to automatically rebuild the server when changes are made to the code.
* Use the `npm run dev` command in the client directory to start the development server


