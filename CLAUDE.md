# CLAUDE.md — AI Agent Instructions for Shop-Shop

This file provides Claude (and other AI coding agents) with project-specific context,
conventions, and guidance so they can contribute effectively without introducing
regressions or security issues.

---

## Project Overview

**Shop-Shop** is a full-stack MERN e-commerce application:

- **Frontend:** React 18 + Vite 6 + Apollo Client — lives in `client/`
- **Backend:** Express 4 + Apollo Server 4 + Mongoose 8 — lives in `server/`
- **Database:** MongoDB (local or Atlas)
- **Auth:** JWT via `jsonwebtoken`; passwords hashed with `bcrypt`
- **Payments:** Stripe Checkout

---

## Essential Commands

```bash
# Install all dependencies (server + client)
npm run install

# Start both dev servers concurrently (client :3000, server :3001)
npm run develop

# Seed the database with sample data
npm run seed

# Build the React app for production
npm run build

# Run frontend unit tests
cd client && npm test

# Lint the client code
cd client && npm run lint
```

---

## Architecture Notes

### Monorepo layout
The root `package.json` contains workspace scripts that delegate to `server/` and
`client/` sub-packages.  Dependencies must be installed in the correct sub-directory.

### GraphQL
- **All** data access goes through the `/graphql` endpoint — there are no REST routes.
- Type definitions: `server/schemas/typeDefs.js`
- Resolvers: `server/schemas/resolvers.js`
- Client queries/mutations: `client/src/utils/queries.js` and `mutations.js`

### Global state
The React app uses **Context + useReducer** (no Redux).  State lives in
`client/src/utils/GlobalState.jsx`; action types in `actions.js`; the reducer in
`reducers.js`.

### Offline support
`client/src/utils/helpers.js` → `idbPromise()` syncs the cart, products, and
categories to **IndexedDB** so the app works offline.

### Authentication flow
1. On login/signup the server signs a JWT and returns it.
2. The client stores it in `localStorage` as `id_token`.
3. `client/src/utils/auth.js` (`AuthService` class) reads/validates the token.
4. Apollo Client's `authLink` (`App.jsx`) attaches it as a `Bearer` header.
5. `server/utils/auth.js` (`authMiddleware`) verifies it and sets `req.user`.

---

## Environment Variables

**Never hard-code secrets.** All secrets must come from environment variables.
See `.env.example` for the full list.

| Variable | Where used |
|----------|-----------|
| `JWT_SECRET` | `server/utils/auth.js` |
| `STRIPE_SECRET_KEY` | `server/schemas/resolvers.js` |
| `VITE_STRIPE_PUBLIC_KEY` | `client/src/components/Cart/index.jsx` |
| `MONGODB_URI` | `server/config/connection.js` |

> Vite only exposes env vars prefixed with `VITE_` to the browser bundle.
> Server-side vars must **not** be prefixed with `VITE_`.

---

## Coding Conventions

- **JavaScript** (CommonJS on the server, ESM on the client) — no TypeScript.
- **No default exports from utility files** — use named exports so imports are explicit.
- **React functional components** with hooks only — no class components.
- **CSS custom properties** (defined in `client/src/index.css` `:root`) for all colours,
  spacing, and shadows.  Use `var(--token-name)` instead of hard-coded values.
- Keep resolvers thin: validate auth, call the model, return the result.  Business
  logic belongs in model methods or dedicated utility functions, not in resolvers.

---

## Testing

Tests live in `client/src/tests/`.  The test runner is **Vitest** with `happy-dom`.

```bash
cd client && npm test          # Run all tests
cd client && npm test -- --ui  # Open the Vitest UI
```

When adding new features, add corresponding tests in `client/src/tests/`.

---

## Security Checklist

Before committing, verify:

- [ ] No API keys, passwords, or tokens are hard-coded in source files.
- [ ] New GraphQL mutations that modify user data check `context.user` and throw
  `AuthenticationError` if the user is not authenticated.
- [ ] User-supplied strings are not interpolated into MongoDB queries without
  validation (use Mongoose schema types and `$regex` safely).
- [ ] Any new environment variables are added to `.env.example` with a placeholder.

---

## Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| Lazy-loaded React components must be assigned to a `const` before use in JSX | `const Foo = lazy(() => import('./Foo'))` then `<Foo />` |
| `input type="firstName"` is not a valid HTML type | Use `type="text"` for name fields |
| Stripe amounts must be integers in the smallest currency unit | multiply price × 100 and use `Math.round()` |
| Apollo Server 4 requires `await server.start()` before `expressMiddleware()` | Always call `startApolloServer()` |
| `VITE_` prefix is required for env vars consumed in the browser | Server keys must NOT have this prefix |
