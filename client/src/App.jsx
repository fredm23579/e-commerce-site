import { Suspense, lazy } from 'react';
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
import Loading from './components/Loading'; // Ensure this component exists

// HTTP link to your GraphQL endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Auth link to attach JWT token to headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Error handling for GraphQL and network errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Apollo Client setup
const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache(),
});

// Main App component
function App() {
  return (
    <ApolloProvider client={client}>
      <StoreProvider>
        <Nav />
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </StoreProvider>
    </ApolloProvider>
  );
}

export default App;
