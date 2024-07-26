import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import App from './App.tsx';
import { MovieEditor } from './components/Movies/MovieEditor.tsx';
import { MovieListPage } from './components/Pages/MovieListPage.tsx';

const client = new ApolloClient({
  uri: 'http://localhost:5050/graphql/',
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
        element: <MovieEditor />
      }
    ]
  },
  {
    path: '/create',
    element: <App />,
    children: [
      {
        path: '/create',
        element: <MovieEditor />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>
);
