import App from './App';
import { HomePage } from './pages/Home/HomePage';
import { MovieEditorPage } from './pages/MovieEditor/MovieEditorPage';
// import { MovieListPage } from './pages/MovieList/MovieListPage'; // Uncomment if MovieListPage is needed
import { ArenaPage } from './pages/Arena/ArenaPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { StylesShowcase } from './components/StylesShowcase';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: '/', element: <HomePage /> },
      // { path: 'movielist', element: <MovieListPage /> },
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
      { path: 'arena', element: <ArenaPage /> },
      { path: 'styles', element: <StylesShowcase /> }
    ]
  }
];

export default routes;
