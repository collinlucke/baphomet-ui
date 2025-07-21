import { expect, describe, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import routes from '../routes';
import '@testing-library/jest-dom';
import { mockLocalStorage } from '../components/__mocks__/mockLocalStorage';
import {
  MemoryRouter,
  Route,
  Routes,
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import { MovieListPage } from '../Pages/MovieList/MovieListPage';
import { MockedProvider } from '@apollo/client/testing';
import { WelcomePage } from '../Pages/Welcome/WelcomePage';
import App from '../App';
import mockGetAllMovies from '../components/__mocks__/mockGetAllMovies';
import mockCheckAuth from '../components/__mocks__/mockCheckAuth';

beforeEach(() => mockLocalStorage());

const mocks = [mockGetAllMovies, mockCheckAuth];

describe('App', () => {
  describe(`'beenHereBefore' HAS NOT been set`, () => {
    it(`renders the <WelcomePage>`, async () => {
      const router = createBrowserRouter(routes);

      render(
        <MockedProvider>
          <RouterProvider router={router} />
        </MockedProvider>
      );

      expect(screen.getByTestId('welcome-page'));
    });

    it(`matches the snapshot with <WelcomePage>`, async () => {
      const router = createBrowserRouter(routes);

      const { container } = render(
        <MockedProvider>
          <RouterProvider router={router} />
        </MockedProvider>
      );

      expect(screen.getByTestId('welcome-page'));

      expect(container).toMatchSnapshot();
    });
  });

  describe(`'beenHereBefore' HAS been set`, () => {
    it(`redirects to MovieListPage`, async () => {
      localStorage.setItem('beenHereBefore', 'yup');

      render(
        <MockedProvider mocks={mocks}>
          <MemoryRouter>
            <App />
            <Routes>
              <Route path={'/'} element={<WelcomePage />} />
              <Route path={'/movielist'} element={<MovieListPage />} />
            </Routes>
          </MemoryRouter>
        </MockedProvider>
      );

      expect(await screen.findByTestId('movie-list'));
    });
  });
});
