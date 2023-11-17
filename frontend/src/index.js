import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './components/ErrorPage';
import { Provider } from 'react-redux';
import { store } from './app/store'
import { ChakraProvider } from "@chakra-ui/react";

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
    // errorElement: <ErrorPage />
  },
]);

root.render(
  <React.StrictMode>
    {/* <ThemeProvider theme={MuiTheme}> */}
    <ChakraProvider>
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
        <RouterProvider router={router} />
      {/* </PersistGate> */}
    </Provider>
    </ChakraProvider>
    {/* </ThemeProvider> */}
  </React.StrictMode>
);


