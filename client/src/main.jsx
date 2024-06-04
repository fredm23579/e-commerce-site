import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';

import App from './App.jsx';
import './index.css';
import Loading from './components/Loading'; // Ensure this component is created or exists

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Suspense fallback={<Loading />}><lazy(() => import('./pages/NoMatch')) /></Suspense>,
    children: [
      { index: true, element: <Suspense fallback={<Loading />}><lazy(() => import('./pages/Home')) /></Suspense> },
      { path: 'login', element: <Suspense fallback={<Loading />}><lazy(() => import('./pages/Login')) /></Suspense> },
      { path: 'signup', element: <Suspense fallback={<Loading />}><lazy(() => import('./pages/Signup')) /></Suspense> },
      { path: 'success', element: <Suspense fallback={<Loading />}><lazy(() => import('./pages/Success')) /></Suspense> },
      { path: 'orderHistory', element: <Suspense fallback={<Loading />}><lazy(() => import('./pages/OrderHistory')) /></Suspense> },
      { path: 'products/:id', element: <Suspense fallback={<Loading />}><lazy(() => import('./pages/Detail')) /></Suspense> }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
