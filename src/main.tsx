import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './App.tsx';
import { EditMoviePage } from './components/Pages/EditMoviePage.tsx';
import { MovieListPage } from './components/Pages/MovieListPage.tsx';

const baseURL =
  import.meta.env.VITE_NODE_ENV === 'development'
    ? import.meta.env.VITE_LOCAL_BASE_URL
    : import.meta.env.VITE_SERVER_BASE_URL;

const client = new ApolloClient({
  uri: `${baseURL}/graphql/`,
  cache: new InMemoryCache()
});

// TODO: This is prolly gonna get moved to it's own file
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <MovieListPage />
      }
    ]
  },
  {
    path: '/edit/:id',
    element: <App />,
    children: [
      {
        path: '/edit/:id',
        element: <EditMoviePage />
      }
    ]
  }
  // {
  //   path: '/create',
  //   element: <App />,
  //   children: [
  //     {
  //       path: '/create',
  //       element: <MovieEditor />
  //     }
  //   ]
  // }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>
);
