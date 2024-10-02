import App from './App.tsx';
import { Login } from './components/Pages/Login.tsx';
import { EditMoviePage } from './components/Pages/EditMoviePage.tsx';
import { MovieListPage } from './components/Pages/MovieListPage.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';

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
        element: <ProtectedRoute element={EditMoviePage} />
      }
    ]
  },
  {
    path: '/create',
    element: <App />,
    children: [
      {
        path: '/create',
        element: (
          <ProtectedRoute element={EditMoviePage} props={{ clean: true }} />
        )
      }
    ]
  },
  {
    path: '/login',
    element: <App />,
    children: [
      {
        path: '/login',
        element: <Login />
      }
    ]
  }
];

export default routes;
