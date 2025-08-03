import '@testing-library/jest-dom';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockLocalStorage } from '../__mocks__/mockLocalStorage';
import { Heading } from '../Heading';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { isAuthenticatedVar } from '../../reactiveVars';

beforeEach(() => {
  mockLocalStorage();
  // Reset authentication state
  isAuthenticatedVar(false);
});

describe('Heading', () => {
  describe('Basic rendering', () => {
    it('renders the logo/home link correctly', async () => {
      render(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <Heading
              setShowLoginModal={() => {}}
              setShowSignupModal={() => {}}
            />
          </BrowserRouter>
        </MockedProvider>
      );

      expect(await screen.findByTestId('home-link')).toBeVisible();
      expect(screen.getByText('Baphomet')).toBeVisible();
    });

    it('renders navigation buttons', async () => {
      render(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <Heading
              setShowLoginModal={() => {}}
              setShowSignupModal={() => {}}
            />
          </BrowserRouter>
        </MockedProvider>
      );

      expect(screen.getByText('Arena')).toBeVisible();
      expect(screen.getByText('Leader Boards')).toBeVisible();
      expect(screen.getByText('All Movies')).toBeVisible();
    });
  });

  describe('When user is NOT authenticated', () => {
    beforeEach(() => {
      isAuthenticatedVar(false);
    });

    it('shows Sign Up and Log in buttons', async () => {
      render(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <Heading
              setShowLoginModal={() => {}}
              setShowSignupModal={() => {}}
            />
          </BrowserRouter>
        </MockedProvider>
      );

      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
    });

    it('does NOT show Add new movie button', async () => {
      render(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <Heading
              setShowLoginModal={() => {}}
              setShowSignupModal={() => {}}
            />
          </BrowserRouter>
        </MockedProvider>
      );

      expect(screen.queryByTestId('add-new-movie-button')).toBeNull();
    });

    it('opens signup modal when Sign Up button is clicked', async () => {
      const user = userEvent.setup();
      const mockSetShowSignupModal = vi.fn();
      const mockSetShowLoginModal = vi.fn();

      render(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <Heading
              setShowLoginModal={mockSetShowLoginModal}
              setShowSignupModal={mockSetShowSignupModal}
            />
          </BrowserRouter>
        </MockedProvider>
      );

      await user.click(screen.getByTestId('signup-button'));

      // Verify the callback was called with true to open the modal
      expect(mockSetShowSignupModal).toHaveBeenCalledWith(true);
      expect(mockSetShowLoginModal).not.toHaveBeenCalled();
    });

    it('opens login modal when Log in button is clicked', async () => {
      const user = userEvent.setup();
      const mockSetShowSignupModal = vi.fn();
      const mockSetShowLoginModal = vi.fn();

      render(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <Heading
              setShowLoginModal={mockSetShowLoginModal}
              setShowSignupModal={mockSetShowSignupModal}
            />
          </BrowserRouter>
        </MockedProvider>
      );

      await user.click(screen.getByTestId('login-button'));

      // Verify the callback was called with true to open the modal
      expect(mockSetShowLoginModal).toHaveBeenCalledWith(true);
      expect(mockSetShowSignupModal).not.toHaveBeenCalled();
    });
  });

  describe('When user IS authenticated', () => {
    beforeEach(() => {
      isAuthenticatedVar(true);
    });

    it('shows Add new movie button', async () => {
      render(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <Heading
              setShowLoginModal={() => {}}
              setShowSignupModal={() => {}}
            />
          </BrowserRouter>
        </MockedProvider>
      );

      expect(await screen.findByTestId('add-new-movie-button')).toBeVisible();
    });

    it('shows Log out button', async () => {
      render(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <Heading
              setShowLoginModal={() => {}}
              setShowSignupModal={() => {}}
            />
          </BrowserRouter>
        </MockedProvider>
      );

      expect(screen.getByTestId('logout-button')).toBeVisible();
    });

    it('does NOT show Sign Up and Log in buttons', async () => {
      render(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <Heading
              setShowLoginModal={() => {}}
              setShowSignupModal={() => {}}
            />
          </BrowserRouter>
        </MockedProvider>
      );

      expect(screen.queryByTestId('signup-button')).toBeNull();
      expect(screen.queryByTestId('login-button')).toBeNull();
    });

    it('logs out user when Log out button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <Heading
              setShowLoginModal={() => {}}
              setShowSignupModal={() => {}}
            />
          </BrowserRouter>
        </MockedProvider>
      );

      await user.click(screen.getByText('Log out'));

      // Wait for the reactive variable to update and component to re-render
      await waitFor(() => {
        expect(screen.getByText('Sign Up')).toBeVisible();
        expect(screen.getByText('Log in')).toBeVisible();
      });
    });
  });

  describe('Snapshots', () => {
    it('matches snapshot when not authenticated', async () => {
      isAuthenticatedVar(false);

      const { container } = render(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <Heading
              setShowLoginModal={() => {}}
              setShowSignupModal={() => {}}
            />
          </BrowserRouter>
        </MockedProvider>
      );

      expect(container).toMatchSnapshot('heading-not-authenticated');
    });

    it('matches snapshot when authenticated', async () => {
      isAuthenticatedVar(true);

      const { container } = render(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <Heading
              setShowLoginModal={() => {}}
              setShowSignupModal={() => {}}
            />
          </BrowserRouter>
        </MockedProvider>
      );

      expect(container).toMatchSnapshot('heading-authenticated');
    });
  });
});
