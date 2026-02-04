import '@testing-library/jest-dom';
import { expect, describe, it, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react';
import type { MockedResponse } from '@apollo/client/testing';
import { GraphQLError } from 'graphql';
import { Header } from '../Layouts/Header';
import { LoginForm } from '../ModalContents/LoginForm';
import { SignupForm } from '../ModalContents/SignupForm';
import { ModalContent } from '../ModalContents/ModalContent';
import {
  isAuthenticatedVar,
  showSignUpModalVar,
  showLoginModalVar
} from '../../reactiveVars';
import { useReactiveVar } from '@apollo/client/react';
import { LOGIN, SIGNUP } from '../../api/mutations';
import { mockLocalStorage } from './__mocks__/mockLocalStorage';

beforeEach(() => {
  mockLocalStorage();
  isAuthenticatedVar(false);
  showSignUpModalVar(false);
  showLoginModalVar(false);
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

const TestAuthComponent: React.FC<{ mocks: MockedResponse[] }> = ({
  mocks
}) => {
  const showLoginModal = useReactiveVar(showLoginModalVar);
  const showSignUpModal = useReactiveVar(showSignUpModalVar); // if needed

  return (
    // <ThemeProvider theme={baseTheme}>
    <MockedProvider mocks={mocks}>
      <BrowserRouter>
        <Header />
        {showLoginModal && (
          <ModalContent title="Login">
            <LoginForm
              onSuccess={() => showLoginModalVar(false)}
              onError={() => {}}
            />
            <button onClick={() => showLoginModalVar(false)} aria-label="Close">
              Close
            </button>
          </ModalContent>
        )}
        {showSignUpModal && (
          <ModalContent title="Sign Up">
            <SignupForm
              onSuccess={() => showSignUpModalVar(false)}
              onError={() => {}}
            />
            <button
              onClick={() => showSignUpModalVar(false)}
              aria-label="Close"
            >
              Close
            </button>
          </ModalContent>
        )}
      </BrowserRouter>
    </MockedProvider>
    // </ThemeProvider>
  );
};
const renderHeader = (mocks: MockedResponse[] = []) => {
  return render(<TestAuthComponent mocks={mocks} />);
};

describe('Authentication Integration Tests', () => {
  describe('Login Flow', () => {
    it.only('completes full login flow successfully', async () => {
      const user = userEvent.setup();
      renderHeader([mockSuccessfulLogin]);

      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();

      await user.click(screen.getByTestId('login-button'));

      expect(showLoginModalVar()).toBe(true);

      await waitFor(() => {
        expect(screen.getByTestId('login-form')).toBeVisible();
      });

      await user.type(
        screen.getByTestId('login-email-input'),
        'test@example.com'
      );
      await user.type(
        screen.getByTestId('login-password-input'),
        'password123'
      );

      await user.click(screen.getByTestId('login-submit-button'));

      await waitFor(() => {
        expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
      });

      expect(showLoginModalVar()).toBe(false);

      // await waitFor(() => {
      expect(screen.getByTestId('logout-button')).toBeVisible();
      // expect(screen.getByTestId('add-new-movie-button')).toBeVisible();
      // expect(screen.queryByTestId('signup-button')).not.toBeInTheDocument();
      // expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();
      // });

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
        result: {
          errors: [new GraphQLError('Invalid email or password')]
        }
      };

      const user = userEvent.setup();
      renderHeader([mockLoginError]);

      await user.click(screen.getByTestId('login-button'));
      await waitFor(() => {
        expect(screen.getByTestId('login-form')).toBeVisible();
      });

      await user.type(
        screen.getByTestId('login-email-input'),
        'wrong@example.com'
      );
      await user.type(
        screen.getByTestId('login-password-input'),
        'wrongpassword'
      );
      await user.click(screen.getByTestId('login-submit-button'));

      await waitFor(() => {
        const loginModal = screen.getByTestId('login-form');
        expect(
          screen.getByText('Invalid email or password')
        ).toBeInTheDocument();
        expect(loginModal).toBeVisible();
      });

      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
      expect(localStorage.getItem('baphomet-token')).toBeNull();
    });
  });

  describe('Signup Flow', () => {
    it('completes full signup flow successfully', async () => {
      const user = userEvent.setup();
      renderHeader([mockSuccessfulSignup]);

      await user.click(screen.getByTestId('signup-button'));

      await waitFor(() => {
        expect(screen.getByTestId('signup-form')).toBeVisible();
      });

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

      await user.click(screen.getByTestId('signup-submit-button'));

      await waitFor(() => {
        expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId('logout-button')).toBeVisible();
        expect(screen.getByTestId('add-new-movie-button')).toBeVisible();
        expect(screen.queryByTestId('signup-button')).not.toBeInTheDocument();
        expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();
      });

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
        result: {
          errors: [new GraphQLError('Username already exists')]
        }
      };

      const user = userEvent.setup();
      renderHeader([mockSignupError]);

      await user.click(screen.getByTestId('signup-button'));
      await waitFor(() => {
        expect(screen.getByTestId('signup-form')).toBeVisible();
      });

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

      await waitFor(() => {
        expect(screen.getByText('Username already exists')).toBeInTheDocument();
        expect(screen.getByTestId('signup-form')).toBeVisible();
      });

      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
      expect(localStorage.getItem('baphomet-token')).toBeNull();
    });
  });

  describe('Logout Flow', () => {
    it('completes full logout flow successfully', async () => {
      const user = userEvent.setup();

      isAuthenticatedVar(true);
      localStorage.setItem('baphomet-token', 'existing-token');

      renderHeader();

      expect(screen.getByTestId('logout-button')).toBeVisible();
      expect(screen.getByTestId('add-new-movie-button')).toBeVisible();
      expect(screen.queryByTestId('signup-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();

      await user.click(screen.getByTestId('logout-button'));

      await waitFor(() => {
        expect(screen.getByTestId('signup-button')).toBeVisible();
        expect(screen.getByTestId('login-button')).toBeVisible();
        expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
        expect(
          screen.queryByTestId('add-new-movie-button')
        ).not.toBeInTheDocument();
      });

      expect(localStorage.getItem('baphomet-token')).toBeNull();
    });

    it('logout button has proper accessibility attributes', async () => {
      isAuthenticatedVar(true);
      renderHeader();

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
      renderHeader();

      await user.click(screen.getByTestId('login-button'));
      await waitFor(() => {
        expect(screen.getByTestId('login-form')).toBeVisible();
      });

      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
    });

    it('can close signup modal without submitting', async () => {
      const user = userEvent.setup();
      renderHeader();

      await user.click(screen.getByTestId('signup-button'));
      await waitFor(() => {
        expect(screen.getByTestId('signup-form')).toBeVisible();
      });

      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();
    });

    it('can switch between login and signup modals', async () => {
      const user = userEvent.setup();
      renderHeader([mockSuccessfulLogin, mockSuccessfulSignup]);

      await user.click(screen.getByTestId('login-button'));
      await waitFor(() => {
        expect(screen.getByTestId('login-form')).toBeVisible();
      });

      await user.click(screen.getByRole('button', { name: /close/i }));
      await waitFor(() => {
        expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
      });

      await user.click(screen.getByTestId('signup-button'));
      await waitFor(() => {
        expect(screen.getByTestId('signup-form')).toBeVisible();
      });

      expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
      expect(screen.getByTestId('signup-form')).toBeVisible();
    });
  });

  describe('Authentication State Persistence', () => {
    it('maintains authentication state across component re-renders', async () => {
      isAuthenticatedVar(true);
      localStorage.setItem('baphomet-token', 'persisted-token');

      const { rerender } = renderHeader();

      expect(screen.getByTestId('logout-button')).toBeVisible();
      expect(screen.getByTestId('add-new-movie-button')).toBeVisible();

      rerender(
        <MockedProvider mocks={[]}>
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </MockedProvider>
      );

      expect(screen.getByTestId('logout-button')).toBeVisible();
      expect(screen.getByTestId('add-new-movie-button')).toBeVisible();
    });

    it('reflects changes in authentication state via reactive var', async () => {
      renderHeader();

      expect(screen.getByTestId('signup-button')).toBeVisible();
      expect(screen.getByTestId('login-button')).toBeVisible();

      isAuthenticatedVar(true);

      await waitFor(() => {
        expect(screen.getByTestId('logout-button')).toBeVisible();
        expect(screen.queryByTestId('signup-button')).not.toBeInTheDocument();
        expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();
      });
    });
  });
});
