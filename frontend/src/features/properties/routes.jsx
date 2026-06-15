import React from 'react';
import PropertyListingPage from './pages/PropertyListingPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';

const propertyRoutes = [
  {
    path: 'properties',
    element: <PropertyListingPage />,
  },
  {
    path: 'property/:id',
    element: <PropertyDetailsPage />,
  },
];

export default propertyRoutes;
