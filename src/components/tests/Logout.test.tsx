import '@testing-library/jest-dom';
import { expect, describe, it, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react';
import { Header } from '../Layouts/Header';
import {
  isAuthenticatedVar,
  isLargeScreenVar,
  isMobileVar,
  isSmallOrMobileVar,
  showSlideOutMenuVar
} from '../../reactiveVars';
import { mockLocalStorage } from './__mocks__/mockLocalStorage';

beforeEach(() => {
  mockLocalStorage();
  isAuthenticatedVar(false);
  isLargeScreenVar(true);
  isMobileVar(false);
  isSmallOrMobileVar(false);
  showSlideOutMenuVar(false);
});

const rememberAdmin = () => {
  localStorage.setItem(
    'baphomet-user',
    JSON.stringify({
      id: '1',
      username: 'test',
      role: 'admin',
      displayName: 'Test User'
    })
  );
};

const openAccountMenu = () => {
  const menu = screen.getByRole('button', { name: /account menu/i });
  if (menu.getAttribute('aria-expanded') !== 'true') {
    fireEvent.click(menu);
  }
};

const logoutButton = () => {
  openAccountMenu();
  return screen.getByRole('button', { name: 'Logout' });
};

const addMovieButton = () => {
  openAccountMenu();
  return screen.getByRole('button', { name: 'Add Movie' });
};

const renderHeading = () => {
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
      renderHeading();

      expect(logoutButton()).toBeVisible();
      expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    });

    it('does not show logout button when user is not authenticated', () => {
      isAuthenticatedVar(false);
      renderHeading();

      expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
    });
  });

  describe('Logout Action', () => {
    it('successfully logs out user when logout button is clicked', async () => {
      const user = userEvent.setup();

      isAuthenticatedVar(true);
      rememberAdmin();
      localStorage.setItem('baphomet-token', 'existing-token');

      renderHeading();

      expect(logoutButton()).toBeVisible();
      expect(addMovieButton()).toBeVisible();
      expect(screen.queryByTestId('signup-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();
      expect(localStorage.getItem('baphomet-token')).toBe('existing-token');

      await user.click(logoutButton());

      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
      expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Add Movie' })
      ).not.toBeInTheDocument();

      expect(localStorage.getItem('baphomet-token')).toBeNull();
    });

    it('handles logout with no existing token gracefully', async () => {
      const user = userEvent.setup();

      isAuthenticatedVar(true);
      localStorage.removeItem('baphomet-token');

      renderHeading();

      await user.click(logoutButton());

      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
      expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
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

      renderHeading();

      await user.click(logoutButton());

      expect(localStorage.getItem('baphomet-token')).toBeNull();
      expect(localStorage.getItem('other-item')).toBe('should-remain');
    });
  });

  describe('Logout Button Accessibility', async () => {
    it('has proper accessibility attributes', () => {
      isAuthenticatedVar(true);
      renderHeading();

      const button = logoutButton();

      expect(button).toHaveAccessibleName('Logout');
      expect(button).toHaveRole('button');
      expect(button).toBeVisible();
    });

    it('is keyboard accessible', async () => {
      const user = userEvent.setup();
      isAuthenticatedVar(true);
      renderHeading();

      const button = logoutButton();

      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');

      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
    });

    it('responds to Space key activation', async () => {
      const user = userEvent.setup();
      isAuthenticatedVar(true);
      localStorage.setItem('baphomet-token', 'test-token');

      renderHeading();

      const button = logoutButton();

      button.focus();
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

      renderHeading();

      await user.click(logoutButton());

      expect(isAuthenticatedVar()).toBe(false);
    });

    it('maintains logout state across component re-renders', async () => {
      const user = userEvent.setup();

      isAuthenticatedVar(true);
      localStorage.setItem('baphomet-token', 'test-token');

      const { rerender } = renderHeading();

      await user.click(logoutButton());

      rerender(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </MockedProvider>
      );

      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
      expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
      expect(localStorage.getItem('baphomet-token')).toBeNull();
    });
  });

  describe('UI State Changes After Logout', () => {
    it('shows correct navigation buttons after logout', async () => {
      const user = userEvent.setup();

      isAuthenticatedVar(true);
      rememberAdmin();
      renderHeading();

      expect(logoutButton()).toBeVisible();
      expect(addMovieButton()).toBeVisible();
      expect(screen.queryByTestId('signup-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();

      await user.click(logoutButton());

      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
      expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Add Movie' })
      ).not.toBeInTheDocument();
    });

    it('hides user-specific actions after logout', async () => {
      const user = userEvent.setup();

      isAuthenticatedVar(true);
      rememberAdmin();
      renderHeading();

      expect(addMovieButton()).toBeVisible();

      await user.click(logoutButton());

      expect(
        screen.queryByRole('button', { name: 'Add Movie' })
      ).not.toBeInTheDocument();
    });

    it('maintains common navigation elements after logout', async () => {
      const user = userEvent.setup();

      isAuthenticatedVar(true);
      renderHeading();

      expect(screen.getByRole('button', { name: /Arena/ })).toBeVisible();
      expect(screen.getByRole('button', { name: 'Leaderboard' })).toBeVisible();
      expect(screen.getByRole('button', { name: 'All Movies' })).toBeVisible();
      expect(screen.getByTestId('logo-link')).toBeVisible();

      await user.click(logoutButton());

      expect(screen.getByRole('button', { name: /Arena/ })).toBeVisible();
      expect(screen.getByRole('button', { name: 'Leaderboard' })).toBeVisible();
      expect(screen.getByRole('button', { name: 'All Movies' })).toBeVisible();
      expect(screen.getByTestId('logo-link')).toBeVisible();
    });
  });
});
