import App from './App.tsx';
import { EditMoviePage } from './components/Pages/EditMoviePage.tsx';
import { MovieListPage } from './components/Pages/MovieListPage.tsx';

const routes = [
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
  },
  {
    path: '/create',
    element: <App />,
    children: [
      {
        path: '/create',
        element: <EditMoviePage clean />
      }
    ]
  }
];

export default routes;
