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

const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
const router = createBrowserRouter(routes);
const httpLink = createHttpLink({
  uri: `${protocol}://${location.hostname}:${
    protocol === 'https' ? '443' : '5050'
  }/graphql`
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
