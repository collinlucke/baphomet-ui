import '@testing-library/jest-dom';
import { expect, describe, it, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockLocalStorage } from './__mocks__/mockLocalStorage';
import { Header } from '../Layouts/Header';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { InMemoryCache, ApolloClient, ApolloLink } from '@apollo/client';
import {
  isAuthenticatedVar,
  isLargeScreenVar,
  isMobileVar,
  isSmallOrMobileVar,
  showSignUpModalVar,
  showLoginModalVar,
  showSlideOutMenuVar
} from '../../reactiveVars';

beforeEach(() => {
  mockLocalStorage();
  isAuthenticatedVar(false);
  isLargeScreenVar(true);
  isMobileVar(false);
  isSmallOrMobileVar(false);
  showSlideOutMenuVar(false);
  showSignUpModalVar(false);
  showLoginModalVar(false);
});

const openAccountMenu = () => {
  const menu = screen.getByRole('button', { name: /account menu/i });
  if (menu.getAttribute('aria-expanded') !== 'true') {
    fireEvent.click(menu);
  }
};

const mockClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.empty()
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <>{children}</>,
      errorElement: <div>Error</div>
    }
  ]);

  return (
    // <ThemeProvider theme={baseTheme}>
    <ApolloProvider client={mockClient}>
      <RouterProvider router={router} />
    </ApolloProvider>
    // </ThemeProvider>
  );
};

describe('Header', () => {
  describe('Basic rendering', () => {
    it('renders the logo/home link correctly', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      const homeLink = await screen.findByTestId('logo-link');

      expect(homeLink).toBeVisible();
      expect(screen.getByText('Baphy')).toBeVisible();
    });

    it('renders navigation buttons', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /Arena/ })).toBeVisible();
      expect(screen.getByRole('button', { name: 'Leaderboard' })).toBeVisible();
      expect(screen.getByRole('button', { name: 'All Movies' })).toBeVisible();
    });
  });

  describe('When user is NOT authenticated', () => {
    beforeEach(() => {
      isAuthenticatedVar(false);
    });

    it('shows Sign Up and Log in buttons', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
    });

    it('does NOT show Add new movie button', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      expect(screen.queryByRole('button', { name: 'Add Movie' })).toBeNull();
    });

    it('opens signup modal when Sign Up button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      await user.click(screen.getByTestId('signup-button'));

      expect(showSignUpModalVar()).toBe(true);
    });

    it('opens login modal when Log in button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      await user.click(screen.getByTestId('login-button'));

      expect(showLoginModalVar()).toBe(true);
    });
  });

  describe('When user IS authenticated', () => {
    beforeEach(() => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'admin',
        displayName: 'Test User',
        totalVotes: 0,
        joinDate: '2023-01-01',
        emailVerified: true
      };

      localStorage.setItem('baphomet-user', JSON.stringify(mockUser));
      localStorage.setItem('baphomet-token', 'mock-token');
      isAuthenticatedVar(true);
    });

    it('shows Add new movie button', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      openAccountMenu();
      expect(screen.getByRole('button', { name: 'Add Movie' })).toBeInTheDocument();
    });

    it('shows Log out button', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      openAccountMenu();
      expect(screen.getByRole('button', { name: 'Logout' })).toBeVisible();
    });

    it('does NOT show Sign Up and Log in buttons', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      expect(screen.queryByTestId('signup-button')).toBeNull();
      expect(screen.queryByTestId('login-button')).toBeNull();
    });

    it('logs out user when Log out button is clicked', async () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      openAccountMenu();
      fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

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
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      expect(container).toMatchSnapshot('heading-not-authenticated');
    });

    it('matches snapshot when authenticated', async () => {
      beforeEach(() => {
        isAuthenticatedVar(true);
      });

      const { container } = render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      expect(container).toMatchSnapshot('heading-authenticated');
    });
  });
});
