import App from './App.tsx';
import { Login } from './components/Login/LoginPage.tsx';
import { WelcomePage } from './components/Welcome/WelcomePage.tsx';
import { MovieEditorPage } from './components/MovieEditor/MovieEditorPage.tsx';
import { MovieListPage } from './components/MovieList/MovieListPage.tsx';
import { ProtectedRoute } from './components/shared/ProtectedRoute.tsx';
import { ArenaPage } from './components/Arena/ArenaPage.tsx';

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <WelcomePage /> },
      { path: 'movielist', element: <MovieListPage /> },
      { path: 'view/:id', element: <MovieEditorPage readonly /> },
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
      { path: 'arena', element: <ProtectedRoute element={ArenaPage} /> }
    ]
  },
  { path: '/login', element: <Login /> }
];

export default routes;
