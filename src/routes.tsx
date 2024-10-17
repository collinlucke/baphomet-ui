import App from './App.tsx';
import { Login } from './components/Pages/Login.tsx';
import { WelcomePage } from './components/Pages/WelcomePage.tsx';
import { EditMoviePage } from './components/Pages/EditMoviePage.tsx';
import { MovieListPage } from './components/Pages/MovieListPage.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { ArenaPage } from './components/Pages/ArenaPage.tsx';

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <WelcomePage />
      }
    ]
  },
  {
    path: '/movielist',
    element: <App />,
    children: [
      {
        path: '/movielist',
        element: <MovieListPage />
      }
    ]
  },
  {
    path: '/view/:id',
    element: <App />,
    children: [
      {
        path: '/view/:id',
        element: <EditMoviePage readonly />
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
  },
  {
    path: '/arena',
    element: <App />,
    children: [
      {
        path: '/arena',
        element: <ProtectedRoute element={ArenaPage} />
      }
    ]
  }
];

export default routes;
