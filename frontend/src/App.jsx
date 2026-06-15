import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './core/router/router';
import { Toaster } from 'sonner';

function App() {
  return (
      <>

          <Toaster richColors position="top-right" />

        <RouterProvider router={router} />
      </>
  );
}
export default App;
