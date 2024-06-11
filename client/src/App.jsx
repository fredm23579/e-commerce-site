// client/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import Nav from './components/Nav';
import { StoreProvider } from './utils/GlobalState';
import Home from './pages/Home';
import Detail from './pages/Detail';
import NoMatch from './pages/NoMatch';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';
import Favorites from './pages/Favorites';
import Success from './pages/Success';

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <StoreProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/OrderHistory" element={<OrderHistory />} />
          <Route path="/Wishlist" element={<Wishlist />} />
          <Route path="/Favorites" element={<Favorites />} />
          <Route path="/Success" element={<Success />} />
          <Route path="/Products/:id" element={<Detail />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </StoreProvider>
    </ApolloProvider>
  );
}

export default App;
