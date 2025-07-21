import App from './App.tsx';
import { Login } from './Pages/Login/LoginPage.tsx';
import { WelcomePage } from './Pages/Welcome/WelcomePage.tsx';
import { MovieEditorPage } from './Pages/MovieEditor/MovieEditorPage.tsx';
import { MovieListPage } from './Pages/MovieList/MovieListPage.tsx';
import { ArenaPage } from './Pages/Arena/ArenaPage.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: '/', element: <WelcomePage /> },
      { path: 'movielist', element: <MovieListPage /> },
      {
        path: 'view/:id',
        element: <MovieEditorPage readonly />
      },
      {
        path: 'edit/:id',
        element: <ProtectedRoute element={MovieEditorPage} />
      },
      {
        path: 'create',
        element: (
          <ProtectedRoute element={MovieEditorPage} props={{ clean: true }} />
        )
      },
      { path: 'arena', element: <ArenaPage /> }
    ]
  },
  { path: '/login', element: <Login /> }
];

export default routes;
