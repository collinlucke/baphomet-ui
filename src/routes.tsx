import App from './App.tsx';
import { HomePage } from './pages/Home/HomePage.tsx';
// import { MovieListPage } from './Pages/MovieList/MovieListPage.tsx'; // Uncomment if MovieListPage is needed
import { AllMoviesPage } from './pages/AllMovies/AllMoviesPage.tsx';
import { ArenaPage } from './pages/Arena/ArenaPage.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
// import { StylesShowcase } from './components/StylesShowcase.tsx';
import { AddMoviesPage } from './pages/AddMovies/AddMoviesPage.tsx';

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
