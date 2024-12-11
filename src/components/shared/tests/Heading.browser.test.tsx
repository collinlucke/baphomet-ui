import '@testing-library/jest-dom';
import { expect, describe, it, beforeEach } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { mockLocalStorage } from '../__mocks__/mockLocalStorage';
import { Heading } from '../Heading';
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
  createMemoryRouter
} from 'react-router-dom';
import routes from '../../../routes';
import { MockedProvider } from '@apollo/client/testing';
import mockGetAllMovies from '../__mocks__/mockGetAllMovies';
import mockCheckAuth from '../__mocks__/mockCheckAuth';
import mockGetMovie from '../__mocks__/mockGetMovie';

beforeEach(() => mockLocalStorage());

describe('Heading', () => {
  describe(`'Baphomet' title`, () => {
    it(`renders correctly as a link`, async () => {
      render(
        <BrowserRouter>
          <Heading />
        </BrowserRouter>
      );

      expect(await screen.findByTestId('home-link')).toBeVisible();
    });

    it(`when clicked, it automatically redirects to /movielist if 'beenHereBefore' HAS been set`, async () => {
      // Pretend that we've been to the site before
      localStorage.setItem('beenHereBefore', 'yup');

      const router = createMemoryRouter(routes, {
        initialEntries: ['/view/test-movie-id']
      });

      render(
        <MockedProvider
          mocks={[mockGetAllMovies, mockGetMovie, mockCheckAuth]}
          addTypename={false}
        >
          <RouterProvider router={router} />
        </MockedProvider>
      );

      // Start from /view page so we have a unauthenticated and non-movielist starting point
      expect(screen.getByTestId('movie-editor-form')).toBeVisible();

      // Finds and clicks the home link
      userEvent.click(screen.getByTestId('home-link'));

      // Automatically redirects to the <MoviewListPage>
      expect(await screen.findByTestId('movie-list')).toBeVisible();
    });

    it(`when clicked, goes to the <WelcomePage> if 'beenHereBefore' HAS NOT been set`, async () => {
      const router = createMemoryRouter(routes, {
        initialEntries: ['/view/test-movie-id']
      });

      render(
        <MockedProvider
          mocks={[mockCheckAuth, mockGetMovie]}
          addTypename={false}
        >
          <RouterProvider router={router} />
        </MockedProvider>
      );
      // Make sure we start from /view
      expect(screen.getByTestId('movie-editor-form')).toBeVisible();

      // Finds and clicks the home link in the Heading

      await act(async () => {
        userEvent.click(screen.getByTestId('home-link'));
      });

      // Automatically redirects to the <WelcomePage/>
      expect(await screen.findByTestId('welcome-page')).toBeVisible();
    });
  });

  describe(`'Add new' button`, () => {
    it(`renders the button correctly`, async () => {
      render(
        <BrowserRouter>
          <Heading />
        </BrowserRouter>
      );

      const buttonElem = await screen.findByTestId('add-new-movie-button');

      expect(buttonElem.tagName).toBe('BUTTON');
    });

    it(`redirects to 401 error modal when 'Add new movie' button is clicked`, async () => {
      localStorage.setItem('beenHereBefore', 'yup');

      const router = createBrowserRouter(routes);

      await act(async () => {
        render(
          <MockedProvider
            mocks={[mockGetAllMovies, mockCheckAuth, mockCheckAuth]}
          >
            <RouterProvider router={router} />
          </MockedProvider>
        );
      });

      // Make sure we start out at the <MovieList>
      expect(await screen.findByTestId('movie-list')).toBeVisible();

      const buttonElem = screen.getByTestId('add-new-movie-button');
      await userEvent.click(buttonElem);

      // Confirm Heading is gone as error modals don't allow it
      await waitFor(() => {
        expect(screen.queryByTestId('main-page-heading')).toBeNull();
      });

      expect(await screen.findByTestId('error-modal-401')).toBeVisible();
    });
  });

  it('matches the snapshot', async () => {
    const { container } = render(
      <BrowserRouter>
        <Heading />
      </BrowserRouter>
    );

    expect(container).toMatchSnapshot();
  });
});
