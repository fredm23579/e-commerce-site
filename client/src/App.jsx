import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

import Nav from './components/Nav';
import { StoreProvider } from './utils/GlobalState';
import Loading from './components/Loading';

// ─── Apollo Client setup ──────────────────────────────────────────────────────

// Point the client at the GraphQL endpoint.  In development Vite proxies
// /graphql to localhost:3001; in production the server handles it directly.
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Attach the JWT to every request so the server can identify the current user.
// The token is stored in localStorage under the key 'id_token'.
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Log GraphQL and network errors to the browser console for easier debugging.
// In a production app you might forward these to an error-tracking service.
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error] Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.error(`[Network error] ${networkError}`);
  }
});

// Chain: error logging → auth header injection → HTTP transport.
const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache(),
});

// ─── Root app component ───────────────────────────────────────────────────────

function App() {
  return (
    // ApolloProvider makes the Apollo client available to all child components.
    <ApolloProvider client={client}>
      {/* StoreProvider gives every component access to the global cart/product state. */}
      <StoreProvider>
        <Nav />
        {/* Outlet renders whichever page the current route maps to.
            Suspense shows the Loading spinner while a lazy page chunk is loading. */}
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </StoreProvider>
    </ApolloProvider>
  );
}

export default App;
