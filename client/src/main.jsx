import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

import App from './App.jsx';
import './index.css';
import Loading from './components/Loading';

// Lazy-load each page so they're only fetched when the user navigates to them.
// This keeps the initial bundle small and improves first-load performance.
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Success = lazy(() => import('./pages/Success'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const Detail = lazy(() => import('./pages/Detail'));
const NoMatch = lazy(() => import('./pages/NoMatch'));

// Wrap each lazy component with <Suspense> so React can show a fallback
// spinner while the page chunk is downloading.
const withSuspense = (Component) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    // Show the NoMatch page for any unrecognised path
    errorElement: withSuspense(NoMatch),
    children: [
      { index: true,                element: withSuspense(Home) },
      { path: 'login',              element: withSuspense(Login) },
      { path: 'signup',             element: withSuspense(Signup) },
      { path: 'success',            element: withSuspense(Success) },
      { path: 'orderHistory',       element: withSuspense(OrderHistory) },
      { path: 'products/:id',       element: withSuspense(Detail) },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
