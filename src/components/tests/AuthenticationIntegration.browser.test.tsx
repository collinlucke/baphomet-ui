import '@testing-library/jest-dom';
import { expect, describe, it, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';
import { Heading } from '../Heading';
import { isAuthenticatedVar } from '../../reactiveVars';
import { LOGIN, SIGNUP } from '../../api/mutations';
import { mockLocalStorage } from '../__mocks__/mockLocalStorage';

// Mock localStorage and navigation
beforeEach(() => {
  mockLocalStorage();
  isAuthenticatedVar(false);
});

const mockSuccessfulLogin = {
  request: {
    query: LOGIN,
    variables: {
      email: 'test@example.com',
      password: 'password123'
    }
  },
  result: {
    data: {
      login: {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          displayName: 'Test User',
          totalVotes: 5,
          joinDate: '2024-01-01',
          role: 'user',
          emailVerified: true
        }
      }
    }
  }
};

const mockSuccessfulSignup = {
  request: {
    query: SIGNUP,
    variables: {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
      displayName: 'New User'
    }
  },
  result: {
    data: {
      signup: {
        token: 'mock-signup-token',
        user: {
          id: '2',
          username: 'newuser',
          email: 'new@example.com',
          displayName: 'New User',
          totalVotes: 0,
          joinDate: '2025-01-01',
          role: 'user',
          emailVerified: false
        }
      }
    }
  }
};

const renderHeading = (mocks: MockedResponse[] = []) => {
  return render(
    <MockedProvider mocks={mocks}>
      <BrowserRouter>
        <Heading />
      </BrowserRouter>
    </MockedProvider>
  );
};

describe('Authentication Integration Tests', () => {
  describe('Login Flow', () => {
    it('completes full login flow successfully', async () => {
      const user = userEvent.setup();
      renderHeading([mockSuccessfulLogin]);

      // 1. User is not authenticated initially
      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();

      // 2. User clicks login button
      await user.click(screen.getByTestId('login-button'));

      // 3. Login modal opens
      await waitFor(() => {
        expect(screen.getByTestId('login-modal-content')).toBeVisible();
      });

      // 4. User fills out login form
      await user.type(
        screen.getByTestId('login-email-input'),
        'test@example.com'
      );
      await user.type(
        screen.getByTestId('login-password-input'),
        'password123'
      );

      // 5. User submits form
      await user.click(screen.getByTestId('login-submit-button'));

      // 6. Wait for login to complete and modal to close
      await waitFor(() => {
        expect(
          screen.queryByTestId('login-modal-content')
        ).not.toBeInTheDocument();
      });

      // 7. User should now be authenticated - check UI changes
      await waitFor(() => {
        expect(screen.getByTestId('logout-button')).toBeVisible();
        expect(screen.getByTestId('add-new-movie-button')).toBeVisible();
        expect(screen.queryByTestId('signup-button')).not.toBeInTheDocument();
        expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();
      });

      // 8. Check that token was stored
      expect(localStorage.getItem('baphomet-token')).toBe('mock-jwt-token');
    });

    it('handles login errors gracefully', async () => {
      const mockLoginError = {
        request: {
          query: LOGIN,
          variables: {
            email: 'wrong@example.com',
            password: 'wrongpassword'
          }
        },
        error: new GraphQLError('Invalid email or password')
      };

      const user = userEvent.setup();
      renderHeading([mockLoginError]);

      // Open login modal
      await user.click(screen.getByTestId('login-button'));
      await waitFor(() => {
        expect(screen.getByTestId('login-modal-content')).toBeVisible();
      });

      // Submit invalid credentials
      await user.type(
        screen.getByTestId('login-email-input'),
        'wrong@example.com'
      );
      await user.type(
        screen.getByTestId('login-password-input'),
        'wrongpassword'
      );
      await user.click(screen.getByTestId('login-submit-button'));

      // Error should be shown, modal stays open
      await waitFor(() => {
        expect(
          screen.getByText('Invalid email or password')
        ).toBeInTheDocument();
        expect(screen.getByTestId('login-modal-content')).toBeVisible();
      });

      // User should still be unauthenticated
      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
      expect(localStorage.getItem('baphomet-token')).toBeNull();
    });
  });

  describe('Signup Flow', () => {
    it('completes full signup flow successfully', async () => {
      const user = userEvent.setup();
      renderHeading([mockSuccessfulSignup]);

      // 1. User clicks signup button
      await user.click(screen.getByTestId('signup-button'));

      // 2. Signup modal opens
      await waitFor(() => {
        expect(screen.getByTestId('signup-modal-content')).toBeVisible();
      });

      // 3. User fills out signup form
      await user.type(screen.getByTestId('signup-username-input'), 'newuser');
      await user.type(
        screen.getByTestId('signup-display-name-input'),
        'New User'
      );
      await user.type(
        screen.getByTestId('signup-email-input'),
        'new@example.com'
      );
      await user.type(
        screen.getByTestId('signup-password-input'),
        'password123'
      );
      await user.type(
        screen.getByTestId('signup-confirm-password-input'),
        'password123'
      );

      // 4. User submits form
      await user.click(screen.getByTestId('signup-submit-button'));

      // 5. Wait for signup to complete and modal to close
      await waitFor(() => {
        expect(
          screen.queryByTestId('signup-modal-content')
        ).not.toBeInTheDocument();
      });

      // 6. User should now be authenticated
      await waitFor(() => {
        expect(screen.getByTestId('logout-button')).toBeVisible();
        expect(screen.getByTestId('add-new-movie-button')).toBeVisible();
        expect(screen.queryByTestId('signup-button')).not.toBeInTheDocument();
        expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();
      });

      // 7. Check that token was stored
      expect(localStorage.getItem('baphomet-token')).toBe('mock-signup-token');
    });

    it('handles signup errors gracefully', async () => {
      const mockSignupError = {
        request: {
          query: SIGNUP,
          variables: {
            username: 'existinguser',
            email: 'existing@example.com',
            password: 'password123',
            displayName: 'Existing User'
          }
        },
        error: new GraphQLError('Username already exists')
      };

      const user = userEvent.setup();
      renderHeading([mockSignupError]);

      // Open signup modal
      await user.click(screen.getByTestId('signup-button'));
      await waitFor(() => {
        expect(screen.getByTestId('signup-modal-content')).toBeVisible();
      });

      // Submit form with existing username
      await user.type(
        screen.getByTestId('signup-username-input'),
        'existinguser'
      );
      await user.type(
        screen.getByTestId('signup-display-name-input'),
        'Existing User'
      );
      await user.type(
        screen.getByTestId('signup-email-input'),
        'existing@example.com'
      );
      await user.type(
        screen.getByTestId('signup-password-input'),
        'password123'
      );
      await user.type(
        screen.getByTestId('signup-confirm-password-input'),
        'password123'
      );
      await user.click(screen.getByTestId('signup-submit-button'));

      // Error should be shown, modal stays open
      await waitFor(() => {
        expect(screen.getByText('Username already exists')).toBeInTheDocument();
        expect(screen.getByTestId('signup-modal-content')).toBeVisible();
      });

      // User should still be unauthenticated
      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
      expect(localStorage.getItem('baphomet-token')).toBeNull();
    });
  });

  describe('Logout Flow', () => {
    it('completes full logout flow successfully', async () => {
      const user = userEvent.setup();

      // Start with authenticated user
      isAuthenticatedVar(true);
      localStorage.setItem('baphomet-token', 'existing-token');

      renderHeading();

      // 1. User should be authenticated initially
      expect(screen.getByTestId('logout-button')).toBeVisible();
      expect(screen.getByTestId('add-new-movie-button')).toBeVisible();
      expect(screen.queryByTestId('signup-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();

      // 2. User clicks logout button
      await user.click(screen.getByTestId('logout-button'));

      // 3. User should now be logged out
      await waitFor(() => {
        expect(screen.getByTestId('signup-button')).toBeVisible();
        expect(screen.getByTestId('login-button')).toBeVisible();
        expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('add-new-movie-button')
        ).not.toBeInTheDocument();
      });

      // 4. Token should be removed from localStorage
      expect(localStorage.getItem('baphomet-token')).toBeNull();
    });

    it('logout button has proper accessibility attributes', async () => {
      isAuthenticatedVar(true);
      renderHeading();

      const logoutButton = screen.getByTestId('logout-button');
      expect(logoutButton).toHaveAttribute(
        'aria-label',
        'Sign out of your account'
      );
      expect(logoutButton).toBeVisible();
    });
  });

  describe('Modal Interactions', () => {
    it('can close login modal without submitting', async () => {
      const user = userEvent.setup();
      renderHeading();

      // Open login modal
      await user.click(screen.getByTestId('login-button'));
      await waitFor(() => {
        expect(screen.getByTestId('login-modal-content')).toBeVisible();
      });

      // Find and click close button (assuming modal has a close button)
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      // Modal should close
      await waitFor(() => {
        expect(
          screen.queryByTestId('login-modal-content')
        ).not.toBeInTheDocument();
      });

      // User should still be unauthenticated
      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
    });

    it('can close signup modal without submitting', async () => {
      const user = userEvent.setup();
      renderHeading();

      // Open signup modal
      await user.click(screen.getByTestId('signup-button'));
      await waitFor(() => {
        expect(screen.getByTestId('signup-modal-content')).toBeVisible();
      });

      // Find and click close button
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      // Modal should close
      await waitFor(() => {
        expect(
          screen.queryByTestId('signup-modal-content')
        ).not.toBeInTheDocument();
      });

      // User should still be unauthenticated
      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
    });

    it('can switch between login and signup modals', async () => {
      const user = userEvent.setup();
      renderHeading([mockSuccessfulLogin, mockSuccessfulSignup]);

      // Open login modal first
      await user.click(screen.getByTestId('login-button'));
      await waitFor(() => {
        expect(screen.getByTestId('login-modal-content')).toBeVisible();
      });

      // Close login modal
      await user.click(screen.getByRole('button', { name: /close/i }));
      await waitFor(() => {
        expect(
          screen.queryByTestId('login-modal-content')
        ).not.toBeInTheDocument();
      });

      // Open signup modal
      await user.click(screen.getByTestId('signup-button'));
      await waitFor(() => {
        expect(screen.getByTestId('signup-modal-content')).toBeVisible();
      });

      // Both modals should not be open at the same time
      expect(
        screen.queryByTestId('login-modal-content')
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('signup-modal-content')).toBeVisible();
    });
  });

  describe('Authentication State Persistence', () => {
    it('maintains authentication state across component re-renders', async () => {
      isAuthenticatedVar(true);
      localStorage.setItem('baphomet-token', 'persisted-token');

      const { rerender } = renderHeading();

      // Should show authenticated state
      expect(screen.getByTestId('logout-button')).toBeVisible();
      expect(screen.getByTestId('add-new-movie-button')).toBeVisible();

      // Re-render component
      rerender(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <Heading />
          </BrowserRouter>
        </MockedProvider>
      );

      // Should still show authenticated state
      expect(screen.getByTestId('logout-button')).toBeVisible();
      expect(screen.getByTestId('add-new-movie-button')).toBeVisible();
    });

    it('reflects changes in authentication state via reactive var', async () => {
      renderHeading();

      // Initially unauthenticated
      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();

      // Programmatically change auth state (simulating external login)
      isAuthenticatedVar(true);

      // Should update UI to show authenticated state
      await waitFor(() => {
        expect(screen.getByTestId('logout-button')).toBeVisible();
        expect(screen.queryByTestId('signup-button')).not.toBeInTheDocument();
        expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();
      });
    });
  });
});
