import { lazy, Suspense } from 'react';
import App from './App.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { ReactErrorBoundary } from './components/ReactErrorBoundary.tsx';
import NotFoundPage from './pages/NotFound/NotFoundPage.tsx';
const HomePage = lazy(() => import('./pages/Home/HomePage.tsx'));
const AllMoviesPage = lazy(() => import('./pages/AllMovies/AllMoviesPage.tsx'));
const ArenaPage = lazy(() => import('./pages/Arena/ArenaPage.tsx'));
const AddMoviesPage = lazy(() => import('./pages/AddMovies/AddMoviesPage.tsx'));
const LeaderboardPage = lazy(
  () => import('./pages/Leaderboard/LeaderboardPage.tsx')
);
const FAQPage = lazy(() => import('./pages/FAQ/FAQPage.tsx'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage.tsx'));
const MovieDetailsPage = lazy(
  () => import('./pages/MovieDetails/MovieDetailsPage.tsx')
);

const withErrorBoundary = (
  Component: React.LazyExoticComponent<React.ComponentType<object>>
) => {
  return (
    <ReactErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Component />
      </Suspense>
    </ReactErrorBoundary>
  );
};

const AddMoviesRoute = lazy(() =>
  Promise.resolve({
    default: () => <ProtectedRoute element={AddMoviesPage} />
  })
);
const ProfileRoute = lazy(() =>
  Promise.resolve({
    default: () => <ProtectedRoute element={ProfilePage} />
  })
);

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: withErrorBoundary(HomePage) },
      { path: 'all-movies', element: withErrorBoundary(AllMoviesPage) },
      {
        path: 'add-movies',
        element: withErrorBoundary(AddMoviesRoute)
      },
      {
        path: 'leaderboard',
        element: withErrorBoundary(LeaderboardPage)
      },
      {
        path: 'view/:id'
      },
      {
        path: 'edit/:id'
      },
      { path: 'arena', element: withErrorBoundary(ArenaPage) },
      {
        path: 'faq',
        element: withErrorBoundary(FAQPage)
      },
      {
        path: 'profile',
        element: withErrorBoundary(ProfileRoute)
      },
      {
        path: 'movie/:id',
        element: withErrorBoundary(MovieDetailsPage)
      },
      { path: '*', element: <NotFoundPage /> }
    ]
  }
];

export default routes;
