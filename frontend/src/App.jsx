import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './core/router/router';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';


function App() {
  return (
      <AuthProvider>

          <Toaster richColors position="top-right" />

        <RouterProvider router={router} />
      </AuthProvider>
  );
}
export default App;
