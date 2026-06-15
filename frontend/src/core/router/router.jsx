import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../../features/home/pages/HomePage';
import propertyRoutes from '../../features/properties/routes';

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
]);
