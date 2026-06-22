import React from 'react';
import PropertyListingPage from './pages/PropertyListingPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import MyPropertiesPage from './pages/MyPropertiesPage';

const propertyRoutes = [
    {
        path: 'properties',
        element: <PropertyListingPage/>,
    },
    {
        path: 'property/:id',
        element: <PropertyDetailsPage/>,
    },
    {
        path: 'my-properties',
        element: <MyPropertiesPage/>,
    },
];

export default propertyRoutes;
