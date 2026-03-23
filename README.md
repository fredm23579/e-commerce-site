# Shop-Shop · E-Commerce Platform

A full-stack MERN e-commerce application with GraphQL, JWT authentication, Stripe payments, and Progressive Web App (PWA) support.

[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![GraphQL](https://img.shields.io/badge/GraphQL-16-E10098?logo=graphql&logoColor=white)](https://graphql.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [GraphQL API](#graphql-api)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Shop-Shop is a production-ready e-commerce template built with the MERN stack.
It uses **Apollo Server 4** for the GraphQL API, **React 18** with lazy-loaded routes for the frontend, **IndexedDB** for offline cart persistence, and **Stripe** for payment processing.

---

## Features

- **Product catalogue** — browse products filtered by category
- **Shopping cart** — add/remove items, update quantities, persisted offline via IndexedDB
- **User authentication** — register and log in with JWT; passwords hashed with bcrypt
- **Checkout** — Stripe-hosted checkout session; order history saved per user
- **PWA** — installable, works offline with a Workbox-powered service worker
- **GraphQL API** — single `/graphql` endpoint for all queries and mutations
- **Responsive design** — mobile-first CSS with a sticky header and adaptive layout

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router 6, Apollo Client 3, Vite 6 |
| Backend | Node.js, Express 4, Apollo Server 4 |
| Database | MongoDB with Mongoose 8 |
| Auth | JSON Web Tokens (jsonwebtoken 9), bcrypt 5 |
| Payments | Stripe |
| Testing | Vitest, Testing Library, happy-dom |
| PWA | vite-plugin-pwa (Workbox) |

---

## Project Structure

```
e-commerce-site/
├── client/                   # React frontend (Vite)
│   ├── public/               # Static assets (favicon, manifest.json)
│   ├── src/
│   │   ├── assets/           # Images, spinner gif
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Cart/         # Cart drawer + Stripe checkout
│   │   │   ├── CartItem/     # Individual cart row
│   │   │   ├── CategoryMenu/ # Category filter buttons
│   │   │   ├── Jumbotron/    # Hero banner wrapper
│   │   │   ├── Loading/      # Suspense fallback spinner
│   │   │   ├── Nav/          # Sticky navigation header
│   │   │   ├── ProductItem/  # Product card
│   │   │   └── ProductList/  # Grid of ProductItem cards
│   │   ├── pages/            # Lazy-loaded route pages
│   │   │   ├── Detail.jsx    # Single product view
│   │   │   ├── Home.jsx      # Landing page
│   │   │   ├── Login.jsx     # Login form
│   │   │   ├── NoMatch.jsx   # 404 page
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── Signup.jsx    # Registration form
│   │   │   └── Success.jsx   # Post-checkout confirmation
│   │   └── utils/
│   │       ├── actions.js    # Redux-style action type constants
│   │       ├── auth.js       # AuthService class (JWT helpers)
│   │       ├── GlobalState.jsx # Context + useReducer store
│   │       ├── helpers.js    # pluralize() + idbPromise()
│   │       ├── mutations.js  # Apollo GraphQL mutations
│   │       ├── queries.js    # Apollo GraphQL queries
│   │       └── reducers.js   # Pure state reducer
│   └── vite.config.js
├── server/
│   ├── config/
│   │   ├── cleanDB.js        # Drops collections before seeding
│   │   ├── connection.js     # Mongoose connection
│   │   └── seeds.js          # Sample data seed script
│   ├── models/
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── User.js
│   │   └── index.js
│   ├── schemas/
│   │   ├── index.js
│   │   ├── resolvers.js      # GraphQL resolver functions
│   │   └── typeDefs.js       # GraphQL type definitions
│   ├── utils/
│   │   └── auth.js           # JWT middleware + signToken
│   └── server.js             # Express + Apollo Server entry point
├── .env.example              # Template for required environment variables
├── package.json              # Root workspace scripts
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) **v18 or higher** (v22 LTS recommended)
- [npm](https://www.npmjs.com) v9+
- [MongoDB](https://www.mongodb.com/try/download/community) v6+ running locally,
  **or** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1 — Clone the repository

```bash
git clone https://github.com/fredm23579/e-commerce-site.git
cd e-commerce-site
```

### 2 — Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the required values — see [Environment Variables](#environment-variables) for details.

### 3 — Install all dependencies

```bash
npm run install
```

This installs packages for both the `server/` and `client/` directories.

### 4 — Seed the database (optional)

```bash
npm run seed
```

Drops and recreates sample categories, products, and two test users.

### 5 — Start the development servers

```bash
npm run develop
```

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Vite dev server (React frontend with hot reload) |
| `http://localhost:3001/graphql` | Apollo GraphQL sandbox |

---

## Environment Variables

Copy `.env.example` to `.env` and set the following:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | No | MongoDB connection string. Defaults to `mongodb://127.0.0.1:27017/mern-shopping` |
| `JWT_SECRET` | **Yes** | Long random string used to sign JWT tokens |
| `STRIPE_SECRET_KEY` | **Yes** | Stripe secret key — obtain from your [Stripe dashboard](https://dashboard.stripe.com/apikeys) |
| `PORT` | No | Server port. Defaults to `3001` |
| `VITE_STRIPE_PUBLIC_KEY` | **Yes** | Stripe publishable key (safe to expose in browser) |

> **Security note:** Never commit your `.env` file or real API keys to version control.
> The `.env.example` file contains only placeholder values and is safe to commit.

---

## Available Scripts

Run from the project root:

| Script | Description |
|--------|-------------|
| `npm run develop` | Start both the Vite dev server and Express server concurrently |
| `npm start` | Start the production Express server |
| `npm run build` | Build the React client for production |
| `npm run preview` | Preview the production build locally |
| `npm run seed` | Seed the database with sample data |
| `npm run install` | Install dependencies for both client and server |

---

## GraphQL API

The API is available at `/graphql`.  Use the Apollo Sandbox at `http://localhost:3001/graphql` during development.

### Queries

| Query | Auth required | Description |
|-------|:-------------:|-------------|
| `categories` | No | All product categories |
| `products(category, name)` | No | Products with optional filters |
| `product(_id!)` | No | Single product |
| `user` | Yes | Current user profile + order history |
| `order(_id!)` | Yes | Single order by ID |
| `checkout(products)` | No | Create Stripe checkout session |

### Mutations

| Mutation | Auth required | Description |
|----------|:-------------:|-------------|
| `addUser(...)` | No | Register a new user; returns a JWT |
| `login(email, password)` | No | Authenticate; returns a JWT |
| `updateUser(...)` | Yes | Update profile fields |
| `addOrder(products)` | Yes | Save a completed order |
| `updateProduct(_id, quantity)` | No | Decrement product stock |

---

## Deployment

### Render (one-click)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/fredm23579/e-commerce-site)

Clicking the button above imports `render.yaml` and pre-fills the service settings.
You will be prompted to supply three environment variables before the deploy starts:

| Variable | Where to get it |
|----------|----------------|
| `MONGODB_URI` | [MongoDB Atlas free tier](https://www.mongodb.com/atlas) → Connect → Drivers |
| `STRIPE_SECRET_KEY` | [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) → Secret key |
| `VITE_STRIPE_PUBLIC_KEY` | [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) → Publishable key |

`JWT_SECRET` is auto-generated by Render (`generateValue: true` in `render.yaml`).

### Manual Render setup

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New > Web Service**.
2. Connect the `fredm23579/e-commerce-site` repo, branch `main`.
3. Render detects `render.yaml` automatically — confirm the settings.
4. Add the three env vars above in the **Environment** tab.
5. Click **Create Web Service**.

### Heroku

```bash
heroku create your-app-name
heroku config:set JWT_SECRET=... STRIPE_SECRET_KEY=... VITE_STRIPE_PUBLIC_KEY=... MONGODB_URI=...
git push heroku main
```

---

## Contributing

1. Fork the repository and create a feature branch (`git checkout -b feat/your-feature`).
2. Commit your changes with a descriptive message.
3. Open a pull request — all PRs are reviewed before merging.

---

## License

Distributed under the [MIT License](LICENSE). © 2024 Fred Motta Ortiz.
