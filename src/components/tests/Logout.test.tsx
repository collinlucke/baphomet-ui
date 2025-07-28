import '@testing-library/jest-dom';
import { expect, describe, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { Heading } from '../Heading';
import { isAuthenticatedVar } from '../../reactiveVars';
import { mockLocalStorage } from '../__mocks__/mockLocalStorage';

beforeEach(() => {
  mockLocalStorage();
  isAuthenticatedVar(false);
});

const renderHeading = () => {
  return render(
    <MockedProvider mocks={[]}>
      <BrowserRouter>
        <Heading />
      </BrowserRouter>
    </MockedProvider>
  );
};

describe('Logout Functionality', () => {
  describe('Logout Button Visibility', () => {
    it('shows logout button when user is authenticated', () => {
      isAuthenticatedVar(true);
      renderHeading();

      expect(screen.getByTestId('logout-button')).toBeVisible();
      expect(screen.getByText('Log out')).toBeInTheDocument();
    });

    it('does not show logout button when user is not authenticated', () => {
      isAuthenticatedVar(false);
      renderHeading();

      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
      expect(screen.queryByText('Log out')).not.toBeInTheDocument();
    });
  });

  describe('Logout Action', () => {
    it('successfully logs out user when logout button is clicked', async () => {
      const user = userEvent.setup();

      // Set up authenticated state with token
      isAuthenticatedVar(true);
      localStorage.setItem('baphomet-token', 'existing-token');

      renderHeading();

      // Verify initial authenticated state
      expect(screen.getByTestId('logout-button')).toBeVisible();
      expect(screen.getByTestId('add-new-movie-button')).toBeVisible();
      expect(screen.queryByTestId('signup-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();
      expect(localStorage.getItem('baphomet-token')).toBe('existing-token');

      // Click logout button
      await user.click(screen.getByTestId('logout-button'));

      // Verify user is logged out
      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('add-new-movie-button')
      ).not.toBeInTheDocument();

      // Verify token is removed from localStorage
      expect(localStorage.getItem('baphomet-token')).toBeNull();
    });

    it('handles logout with no existing token gracefully', async () => {
      const user = userEvent.setup();

      // Set authenticated state but no token in localStorage
      isAuthenticatedVar(true);
      localStorage.removeItem('baphomet-token');

      renderHeading();

      // Click logout button
      await user.click(screen.getByTestId('logout-button'));

      // Should still log out successfully
      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
    });

    it('clears multiple authentication-related items from localStorage', async () => {
      const user = userEvent.setup();

      // Set up authenticated state with multiple auth-related items
      isAuthenticatedVar(true);
      localStorage.setItem('baphomet-token', 'existing-token');
      localStorage.setItem(
        'baphomet-user',
        JSON.stringify({ id: '1', username: 'test' })
      );
      localStorage.setItem('other-item', 'should-remain');

      renderHeading();

      // Click logout button
      await user.click(screen.getByTestId('logout-button'));

      // Token should be removed, but other items should remain
      expect(localStorage.getItem('baphomet-token')).toBeNull();
      expect(localStorage.getItem('other-item')).toBe('should-remain');
    });
  });

  describe('Logout Button Accessibility', async () => {
    it('has proper accessibility attributes', () => {
      isAuthenticatedVar(true);
      renderHeading();

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
      renderHeading();

      const logoutButton = screen.getByTestId('logout-button');

      // Focus the button
      logoutButton.focus();
      expect(logoutButton).toHaveFocus();

      // Press Enter to activate
      await user.keyboard('{Enter}');

      // Should log out
      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
    });

    it('responds to Space key activation', async () => {
      const user = userEvent.setup();
      isAuthenticatedVar(true);
      localStorage.setItem('baphomet-token', 'test-token');

      renderHeading();

      const logoutButton = screen.getByTestId('logout-button');

      // Focus and press Space
      logoutButton.focus();
      await user.keyboard(' ');

      // Should log out
      expect(localStorage.getItem('baphomet-token')).toBeNull();
      expect(screen.getByTestId('signup-button')).toBeVisible();
    });
  });

  describe('State Management', () => {
    it('updates reactive variable when logging out', async () => {
      const user = userEvent.setup();

      // Start authenticated
      isAuthenticatedVar(true);
      expect(isAuthenticatedVar()).toBe(true);

      renderHeading();

      // Logout
      await user.click(screen.getByTestId('logout-button'));

      // Reactive variable should be updated
      expect(isAuthenticatedVar()).toBe(false);
    });

    it('maintains logout state across component re-renders', async () => {
      const user = userEvent.setup();

      isAuthenticatedVar(true);
      localStorage.setItem('baphomet-token', 'test-token');

      const { rerender } = renderHeading();

      // Logout
      await user.click(screen.getByTestId('logout-button'));

      // Re-render component
      rerender(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <Heading />
          </BrowserRouter>
        </MockedProvider>
      );

      // Should still show logged out state
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
      renderHeading();

      // Before logout - authenticated UI
      expect(screen.getByTestId('logout-button')).toBeVisible();
      expect(screen.getByTestId('add-new-movie-button')).toBeVisible();
      expect(screen.queryByTestId('signup-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();

      // Logout
      await user.click(screen.getByTestId('logout-button'));

      // After logout - unauthenticated UI
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
      renderHeading();

      // User-specific actions should be visible when authenticated
      expect(screen.getByTestId('add-new-movie-button')).toBeVisible();

      // Logout
      await user.click(screen.getByTestId('logout-button'));

      // User-specific actions should be hidden after logout
      expect(
        screen.queryByTestId('add-new-movie-button')
      ).not.toBeInTheDocument();
    });

    it('maintains common navigation elements after logout', async () => {
      const user = userEvent.setup();

      isAuthenticatedVar(true);
      renderHeading();

      // Common navigation should be present before logout
      expect(screen.getByText('Arena')).toBeVisible();
      expect(screen.getByText('Leader Boards')).toBeVisible();
      expect(screen.getByText('All Movies')).toBeVisible();
      expect(screen.getByTestId('home-link')).toBeVisible();

      // Logout
      await user.click(screen.getByTestId('logout-button'));

      // Common navigation should still be present after logout
      expect(screen.getByText('Arena')).toBeVisible();
      expect(screen.getByText('Leader Boards')).toBeVisible();
      expect(screen.getByText('All Movies')).toBeVisible();
      expect(screen.getByTestId('home-link')).toBeVisible();
    });
  });
});
