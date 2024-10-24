import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import routes from './routes';
// import { baphTheme } from './styling/baphTheme';
// import BaphThemeProvider from './styling/BaphThemeProvider';

const baseURL =
  import.meta.env.VITE_NODE_ENV === 'development'
    ? import.meta.env.VITE_DEV_URI
    : import.meta.env.VITE_PROD_URI;

const router = createHashRouter(routes);

const httpLink = createHttpLink({
  uri: `${baseURL}/graphql/`
});
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('baphomet-token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

// Not using BaphThemeProvider yet, but he can hang out.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      {/* <BaphThemeProvider theme={baphTheme}> */}
      <RouterProvider router={router} />
      {/* </BaphThemeProvider> */}
    </ApolloProvider>
  </React.StrictMode>
);
