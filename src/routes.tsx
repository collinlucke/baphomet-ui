import App from './App.tsx';
import { HomePage } from './pages/Home/HomePage.tsx';
import { AllMoviesPage } from './pages/AllMovies/AllMoviesPage.tsx';
import { ArenaPage } from './pages/Arena/ArenaPage.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { AddMoviesPage } from './pages/AddMovies/AddMoviesPage.tsx';
import { LeaderboardPage } from './pages/Leaderboard/LeaderboardPage.tsx';

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
        path: 'leaderboard',
        element: <LeaderboardPage />
      },
      {
        path: 'view/:id'
      },
      {
        path: 'edit/:id'
      },
      { path: 'arena', element: <ArenaPage /> }
    ]
  }
];

export default routes;
