import App from './App';
import { HomePage } from './pages/Home/HomePage';
// import { MovieListPage } from './Pages/MovieList/MovieListPage'; // Uncomment if MovieListPage is needed
import { AllMoviesPage } from './pages/AllMovies/AllMoviesPage';
import { ArenaPage } from './pages/Arena/ArenaPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
// import { StylesShowcase } from './components/StylesShowcase';
import { AddMoviesPage } from './pages/AddMovies/AddMoviesPage';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: 'all-movies', element: <AllMoviesPage /> },
      {
        path: 'add-movies',
        element: <ProtectedRoute element={AddMoviesPage} />
      },
      {
        path: 'view/:id'
        // element: <MovieEditorPage readonly />
      },
      {
        path: 'edit/:id'
        // element: <ProtectedRoute element={MovieEditorPage} />
      },
      {
        path: 'create'
        // element: <ProtectedRoute element={MovieEditorPage} props={{ clean: true }} />
      },
      { path: 'arena', element: <ArenaPage /> }
      // { path: 'styles', element: <StylesShowcase /> }
    ]
  }
];

export default routes;
