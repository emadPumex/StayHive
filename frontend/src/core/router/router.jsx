import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../../features/home/pages/HomePage';
import LoginPage from '../../features/auth/pages/LoginPage';
import propertyRoutes from '../../features/properties/routes';
import OAuth2RedirectHandler from "../../features/auth/pages/OAuth2RedirectHandler.jsx";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      ...propertyRoutes,
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/oauth2/redirect',
    element: <OAuth2RedirectHandler />,
  },
]);

