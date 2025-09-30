import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink
} from '@apollo/client/core';
import { ApolloProvider } from '@apollo/client/react';
import { ThemeProvider } from '@emotion/react';
import { baseTheme } from '@collinlucke/phantomartist';
import routes from './routes';
import { logEnvironmentInfo } from './utils/environment';
import 'dotenv';

logEnvironmentInfo();

const redirectPath = sessionStorage.getItem('redirectPath');
if (redirectPath && redirectPath !== '/') {
  sessionStorage.removeItem('redirectPath');
  window.history.replaceState(null, '', redirectPath);
}

const getBackendUrl = () => {
  if (import.meta.env.MODE === 'development') {
    return `http://${window.location.hostname}:5050/graphql`;
  }
  return (
    import.meta.env.VITE_AWS_BAPHOMET_SERVER_URL ||
    'https://api.baphomet.collinlucke.com/graphql'
  );
};

const router = createBrowserRouter(routes);

const httpLink = new HttpLink({
  uri: getBackendUrl()
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('baphomet-token');

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
      'x-apollo-operation-name': 'GraphQLOperation'
    }
  });

  return forward(operation);
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache()
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={baseTheme}>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </ThemeProvider>
  </React.StrictMode>
);
