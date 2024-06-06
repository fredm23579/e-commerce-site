
  <div align="center">
  <h1 align="center">E Commerce Website</h1>
  <h3>Codebase for the E Commerce Wensite platform</h3>
  <h3>◦ Developed with the software and tools below.</h3>
  <p align="center"><img src="https://img.shields.io/badge/-Node.js-004E89?logo=Node.js&style=for-the-badge" alt='Node.js\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-Express.js-004E89?logo=Express.js&style=for-the-badge" alt='Express.js\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-MongoDB-004E89?logo=MongoDB&style=for-the-badge" alt='MongoDB\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-React-004E89?logo=React&style=for-the-badge" alt='React\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-Redux-004E89?logo=Redux&style=for-the-badge" alt='Redux\' />
<img src="https://via.placeholder.com/1/0000/00000000" alt="spacer" /><img src="https://img.shields.io/badge/-Vite-004E89?logo=Vite&style=for-the-badge" alt='Vite"' />
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

 This is a full-stack JavaScript project with a React frontend and a Node.js/Express backend, using MongoDB as the database. The project includes a RESTful API for managing products, orders, and users, as well as a GraphQL API for querying and mutating data. The frontend is built using Vite and React, while the backend is built using Express and MongoDB. The project also includes a JWT authentication system for securing routes and a payment gateway integration for processing payments.

---

## 🌟 Features

 Here is a list of features for the project:<br>
* Full-stack JavaScript project with a React frontend and a Node.js/Express backend
* RESTful API for managing products, orders, and users
* GraphQL API for querying and mutating data
* MongoDB database for storing data
* JWT authentication system for securing routes
* Payment gateway integration for processing payments
* Vite and React for building the frontend
* Express and MongoDB for building the backend

---

## 📁 Repository Structure

```sh
├── .gitignore
├── .gitignore copy
├── client
│   ├── .eslintrc.cjs
│   ├── .gitignore
│   ├── .gitignore copy
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── .gitignore
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
│   │   │   ├── Jumbotron
│   │   │   │   └── index.jsx
│   │   │   ├── Nav
│   │   │   │   └── index.jsx
│   │   │   ├── ProductItem
│   │   │   │   └── index.jsx
│   │   │   └── ProductList
│   │   │       └── index.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── Detail.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NoMatch.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Success.jsx
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
| App.jsx |  The code defines an Apollo Client for a React application, which sets up a GraphQL client with authentication and caching capabilities. |
| main.jsx |  The code creates a React Router browser router and renders it to the root element with the ID root allowing for navigation between different pages in the application. |

</details>

---

<details><summary>\client\src\components\Cart</summary>

| File | Summary |
| ---- | ------- |
| index.jsx |  The code defines a React component called `Cart` that displays a shopping cart and allows users to check out. It uses the Apollo Client library to make queries to the backend, and the Stripe library to handle payments. The component also uses the `useStoreContext` hook to manage global state and the `useLazyQuery` hook to fetch data from the backend. |

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
| index.jsx |  The code defines a React component called CategoryMenu that displays a list of categories and allows the user to select one. It uses the Apollo Client library to fetch data from a GraphQL API, and it also uses the IDB library to store data in IndexedDB for offline access. |

</details>

---

<details><summary>\client\src\components\DeleteBtn</summary>

| File | Summary |
| ---- | ------- |
| index.jsx |  The DeleteBtn component is a custom button element that spreads all passed props onto the element and adds a role of button and a tabIndex of 0 for accessibility. |

</details>

---

<details><summary>\client\src\components\Jumbotron</summary>

| File | Summary |
| ---- | ------- |
| index.jsx |  The Jumbotron function returns a React component that displays its children centered in a 560px high container with a padding of 120px at the top. |

</details>

---

<details><summary>\client\src\components\Nav</summary>

| File | Summary |
| ---- | ------- |
| index.jsx |  The code defines a functional component called `Nav` that renders a header with a logo and navigation links. If the user is logged in, it shows a link to the order history and a logout button. If the user is not logged in, it shows links to signup and login. |

</details>

---

<details><summary>\client\src\components\ProductItem</summary>

| File | Summary |
| ---- | ------- |
| index.jsx |  The ProductItem component is a React functional component that displays an individual product item, including its image, name, price, and quantity in stock. It also includes a button to add the product to the cart, which dispatches an action to update the cart state and adds the product to the IDB (IndexedDB) database. |

</details>

---

<details><summary>\client\src\components\ProductList</summary>

| File | Summary |
| ---- | ------- |
| index.jsx |  The code defines a React component called `ProductList` that retrieves products from a GraphQL API and displays them in a list. It also includes a filter function to display only products in the current category. |

</details>

---

<details><summary>\client\src\pages</summary>

| File | Summary |
| ---- | ------- |
| Detail.jsx |  The code defines a React component called `Detail` that retrieves product data from an API or the IndexedDB cache, displays the product details and allows the user to add or remove the product from the cart. |
| Home.jsx |  The code defines a React component called `Home` that renders a container with a `CategoryMenu`, `ProductList`, and `Cart` components. |
| Login.jsx |  The code defines a login form component for a React application, using the Apollo Client library to handle GraphQL mutations and the Auth library to manage authentication tokens. |
| NoMatch.jsx |  The code defines a React component called NoMatch that renders a 404 page not found message using the Jumbotron component. |
| OrderHistory.jsx |  The code defines a React component called OrderHistory that displays the order history for a user, fetched from a GraphQL API using Apollo Client's useQuery hook. |
| Signup.jsx |  The code defines a Signup component for a React application that allows users to create an account by providing their email, password, first name, and last name. The component uses the useState hook to manage the form state and the useMutation hook from Apollo Client to execute a GraphQL mutation when the form is submitted. The mutation adds the user to the database and returns a token, which is then used to log the user in. |
| Success.jsx |  The code defines a React component called Success, which uses the useMutation hook from Apollo Client to add an order to the database and then deletes the items from the cart after 3 seconds. |

</details>

---

<details><summary>\client\src\utils</summary>

| File | Summary |
| ---- | ------- |
| actions.js |  The code defines a set of constants for managing a shopping cart and its products, including actions such as adding, removing, and updating items, as well as toggling the cart visibility. |
| auth.js |  The code defines a class called AuthService that provides methods for managing authentication tokens and checking if the user is logged in. |
| GlobalState.jsx |  The code defines a React context for managing global state, including products, cart, and categories, using the `createContext` and `useReducer` hooks from React. It also exports a `StoreProvider` component that provides the context value to its children, and a `useStoreContext` hook that allows components to access the context. |
| helpers.js |  The code defines two functions: `pluralize` and `idbPromise`. `pluralize` takes a string and a number, and returns the string with an s added to the end if the number is not 1. `idbPromise` is a wrapper function for IndexedDB transactions, allowing for easy access to the database. |
| mutations.js |  The code defines GraphQL mutations for logging in, adding an order, and adding a user. |
| queries.js |  The code defines GraphQL queries for retrieving products, categories, and user information from a database. |
| reducers.js |  The code defines a reducer function that handles actions related to updating products, adding and removing items from the cart, updating the cart quantity, and toggling the cart open/closed. |

</details>

---

<details><summary>\client</summary>

| File | Summary |
| ---- | ------- |
| vite.config.js |  The code defines a Vite configuration file that sets up a development server with a React plugin, proxying requests to a GraphQL API at port 3001, and enables testing with the happy-dom environment. |

</details>

---

<details><summary>\server\models</summary>

| File | Summary |
| ---- | ------- |
| Category.js |  The code defines a Mongoose model for a Category schema with a single string field ame |
| index.js |  The code exports four models (User, Product, Category, Order) from the current module. |
| Order.js |  The code defines a MongoDB schema for an Order model, with properties for a purchase date and an array of product references. |
| Product.js |  The code defines a product schema for a MongoDB database, with fields for name, description, image, price, quantity, and category, using the Mongoose library. |
| User.js |  The code defines a User model in MongoDB using Mongoose, with fields for first name, last name, email, and password. It also includes pre-save middleware to hash the password and a method to compare incoming passwords with the hashed password. |

</details>

---

<details><summary>\server\schemas</summary>

| File | Summary |
| ---- | ------- |
| index.js |  The code exports the `typeDefs` and `resolvers` objects from the `./typeDefs` and `./resolvers` files, respectively, as part of a GraphQL schema. |
| resolvers.js |  The code defines a set of GraphQL resolvers for a e-commerce application, with the primary function of handling user authentication and retrieving data from a MongoDB database. |
| typeDefs.js |  The code defines a GraphQL schema with types for categories, products, orders, users, and checkout sessions, as well as input types for creating and updating products and orders. |

</details>

---

<details><summary>\server</summary>

| File | Summary |
| ---- | ------- |
| server.js |  The code sets up an Apollo Server with a GraphQL schema, and starts an Express server to serve the app's frontend. |

</details>

---

<details><summary>\server\utils</summary>

| File | Summary |
| ---- | ------- |
| auth.js |  The code defines a module that exports an authentication middleware function, an error object for handling authentication failures, and a signToken function for generating JWT tokens. |

</details>

---

## 🚀 Getting Started

 Getting Started with MERN Shopping<br>=====================================

This guide will help you get started with the MERN Shopping project, a full-stack JavaScript application with a React frontend and a Node.js/Express backend, using MongoDB as the database. The project includes a RESTful API for managing products, orders, and users, as well as a GraphQL API for querying and mutating data.

Prerequisites
-------------

Before starting this guide, make sure you have the following installed on your system:

* Node.js (version 14 or higher)
* npm (version 6 or higher)
* MongoDB (version 4 or higher)
* A text editor or IDE (e.g., Visual Studio Code, IntelliJ IDEA, Sublime Text)

Cloning the Project
--------------------

To get started, clone the MERN Shopping project from GitHub:
```bash
git clone https://github.com/fredm23579/e-commerce-site.git
```
Installing Dependencies
-----------------------

Change into the `server` directory and install the dependencies:
```bash
cd server
npm install
```
Change into the `client` directory and install the dependencies:
```bash
cd ../client
npm install
```
Running the Application
------------------------

To run the application

