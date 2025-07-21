import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import routes from './routes';
import 'dotenv';

// Handle redirect from 404.html before creating router
const redirectPath = sessionStorage.getItem('redirectPath');
if (redirectPath && redirectPath !== '/') {
  sessionStorage.removeItem('redirectPath');
  window.history.replaceState(null, '', redirectPath);
}

const getBackendUrl = () => {
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:5050/graphql';
  }
  // Production: Use your Render backend URL
  return (
    import.meta.env.GRAPHQL_BAPHOMET_SERVER_RENDER_URL ||
    'https://baphomet-server.onrender.com/graphql'
  );
};

const router = createBrowserRouter(routes);
const httpLink = createHttpLink({
  uri: getBackendUrl()
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('baphomet-token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'x-apollo-operation-name': 'GraphQLOperation'
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>
);
