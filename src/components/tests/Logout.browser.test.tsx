import '@testing-library/jest-dom';
import { expect, describe, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react';
import { Header } from '../Layouts/Header';
import { isAuthenticatedVar } from '../../reactiveVars';
import { mockLocalStorage } from './__mocks__/mockLocalStorage';

beforeEach(() => {
  mockLocalStorage();
  isAuthenticatedVar(false);
});

const renderHeader = () => {
  return render(
    <MockedProvider mocks={[]}>
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    </MockedProvider>
  );
};

describe('Logout Functionality', () => {
  describe('Logout Button Visibility', () => {
    it('shows logout button when user is authenticated', () => {
      isAuthenticatedVar(true);
      renderHeader();

      expect(screen.getByTestId('logout-button')).toBeVisible();
      expect(screen.getByText('Log out')).toBeInTheDocument();
    });

    it('does not show logout button when user is not authenticated', () => {
      isAuthenticatedVar(false);
      renderHeader();

      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
      expect(screen.queryByText('Log out')).not.toBeInTheDocument();
    });
  });

  describe('Logout Action', () => {
    it('successfully logs out user when logout button is clicked', async () => {
      const user = userEvent.setup();

      isAuthenticatedVar(true);
      localStorage.setItem('baphomet-token', 'existing-token');

      renderHeader();

      expect(screen.getByTestId('logout-button')).toBeVisible();
      expect(screen.getByTestId('add-new-movie-button')).toBeVisible();
      expect(screen.queryByTestId('signup-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();
      expect(localStorage.getItem('baphomet-token')).toBe('existing-token');

      await user.click(screen.getByTestId('logout-button'));

      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('add-new-movie-button')
      ).not.toBeInTheDocument();

      expect(localStorage.getItem('baphomet-token')).toBeNull();
    });

    it('handles logout with no existing token gracefully', async () => {
      const user = userEvent.setup();

      isAuthenticatedVar(true);
      localStorage.removeItem('baphomet-token');

      renderHeader();

      await user.click(screen.getByTestId('logout-button'));

      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
    });

    it('clears multiple authentication-related items from localStorage', async () => {
      const user = userEvent.setup();

      isAuthenticatedVar(true);
      localStorage.setItem('baphomet-token', 'existing-token');
      localStorage.setItem(
        'baphomet-user',
        JSON.stringify({ id: '1', username: 'test' })
      );
      localStorage.setItem('other-item', 'should-remain');

      renderHeader();

      await user.click(screen.getByTestId('logout-button'));

      expect(localStorage.getItem('baphomet-token')).toBeNull();
      expect(localStorage.getItem('other-item')).toBe('should-remain');
    });
  });

  describe('Logout Button Accessibility', () => {
    it('has proper accessibility attributes', () => {
      isAuthenticatedVar(true);
      renderHeader();

      const logoutButton = screen.getByTestId('logout-button');

      expect(logoutButton).toHaveAttribute(
        'aria-label',
        'Sign out of your account'
      );
      expect(logoutButton).toHaveRole('button');
      expect(logoutButton).toBeVisible();
    });

    it('is keyboard accessible', async () => {
      const user = userEvent.setup();
      isAuthenticatedVar(true);
      renderHeader();

      const logoutButton = screen.getByTestId('logout-button');

      logoutButton.focus();
      expect(logoutButton).toHaveFocus();

      await user.keyboard('{Enter}');

      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
    });

    it('responds to Space key activation', async () => {
      const user = userEvent.setup();
      isAuthenticatedVar(true);
      localStorage.setItem('baphomet-token', 'test-token');

      renderHeader();

      const logoutButton = screen.getByTestId('logout-button');

      logoutButton.focus();
      await user.keyboard(' ');

      expect(localStorage.getItem('baphomet-token')).toBeNull();
      expect(screen.getByTestId('signup-button')).toBeVisible();
    });
  });

  describe('State Management', () => {
    it('updates reactive variable when logging out', async () => {
      const user = userEvent.setup();

      isAuthenticatedVar(true);
      expect(isAuthenticatedVar()).toBe(true);

      renderHeader();

      await user.click(screen.getByTestId('logout-button'));

      expect(isAuthenticatedVar()).toBe(false);
    });

    it('maintains logout state across component re-renders', async () => {
      const user = userEvent.setup();

      isAuthenticatedVar(true);
      localStorage.setItem('baphomet-token', 'test-token');

      const { rerender } = renderHeader();

      await user.click(screen.getByTestId('logout-button'));

      rerender(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </MockedProvider>
      );

      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
      expect(localStorage.getItem('baphomet-token')).toBeNull();
    });
  });

  describe('UI State Changes After Logout', () => {
    it('shows correct navigation buttons after logout', async () => {
      const user = userEvent.setup();

      isAuthenticatedVar(true);
      renderHeader();

      expect(screen.getByTestId('logout-button')).toBeVisible();
      expect(screen.getByTestId('add-new-movie-button')).toBeVisible();
      expect(screen.queryByTestId('signup-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();

      await user.click(screen.getByTestId('logout-button'));

      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('add-new-movie-button')
      ).not.toBeInTheDocument();
    });

    it('hides user-specific actions after logout', async () => {
      const user = userEvent.setup();

      isAuthenticatedVar(true);
      renderHeader();

      expect(screen.getByTestId('add-new-movie-button')).toBeVisible();

      await user.click(screen.getByTestId('logout-button'));

      expect(
        screen.queryByTestId('add-new-movie-button')
      ).not.toBeInTheDocument();
    });

    it('maintains common navigation elements after logout', async () => {
      const user = userEvent.setup();

      isAuthenticatedVar(true);
      renderHeader();

      expect(screen.getByText('Arena')).toBeVisible();
      expect(screen.getByText('Leader Boards')).toBeVisible();
      expect(screen.getByText('All Movies')).toBeVisible();
      expect(screen.getByTestId('home-link')).toBeVisible();

      await user.click(screen.getByTestId('logout-button'));

      expect(screen.getByText('Arena')).toBeVisible();
      expect(screen.getByText('Leader Boards')).toBeVisible();
      expect(screen.getByText('All Movies')).toBeVisible();
      expect(screen.getByTestId('home-link')).toBeVisible();
    });
  });
});
