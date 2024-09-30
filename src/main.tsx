import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import routes from './routes';

const baseURL =
  import.meta.env.NODE_ENV === 'development'
    ? import.meta.env.VITE_DEV_URI
    : import.meta.env.VITE_PROD_URI;

const router = createHashRouter(routes);

const client = new ApolloClient({
  uri: `${baseURL}/graphql/`,
  cache: new InMemoryCache()
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>
);
