import App from './App.tsx';
import { Login } from './components/Login/LoginPage.tsx';
import { WelcomePage } from './components/Welcome/WelcomePage.tsx';
import { MovieEditorPage } from './components/MovieEditor/MovieEditorPage.tsx';
import { MovieListPage } from './components/MovieList/MovieListPage.tsx';
import { ProtectedRoute } from './components/shared/ProtectedRoute.tsx';
import { ArenaPage } from './components/Arena/ArenaPage.tsx';
import { BaphErrorBoundary } from './components/shared/BaphErrorBoundary.tsx';
import { FourOhFour } from './components/shared/FourOhFour.tsx';
// import { useEffect } from 'react';
// import { createRoutesFromElements, Route } from 'react-router-dom';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <BaphErrorBoundary />,
    children: [
      { path: '/', element: <WelcomePage /> },
      { path: 'movielist', element: <MovieListPage /> },
      {
        path: 'view/:id',
        element: <MovieEditorPage readonly />
        // errorElement: <BaphErrorBoundary />
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
      { path: '*', element: <FourOhFour /> } // Catch-all route for errors
    ]
  },
  { path: '/login', element: <Login /> }
];

export default routes;
