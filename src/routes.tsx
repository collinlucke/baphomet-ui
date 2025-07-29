import App from './App.tsx';
import { HomePage } from './Pages/Home/HomePage.tsx';
import { MovieEditorPage } from './Pages/MovieEditor/MovieEditorPage.tsx';
// import { MovieListPage } from './Pages/MovieList/MovieListPage.tsx'; // Uncomment if MovieListPage is needed
import { ArenaPage } from './Pages/Arena/ArenaPage.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { StylesShowcase } from './components/StylesShowcase.tsx';

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
