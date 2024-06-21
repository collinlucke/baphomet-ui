import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import Movie from './components/Movie.jsx';
import MovieList from './components/MovieList.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <MovieList />
      }
    ]
  },
  {
    path: '/edit/:id',
    element: <App />,
    children: [
      {
        path: '/edit/:id',
        element: <Movie />
      }
    ]
  },
  {
    path: '/create',
    element: <App />,
    children: [
      {
        path: '/create',
        element: <Movie />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
