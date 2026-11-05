import '@testing-library/jest-dom';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing/react';
import { GraphQLError } from 'graphql';
import { LoginForm } from '../ModalContents/LoginForm';
import { LOGIN } from '../../api/mutations';
import { mockLocalStorage } from './__mocks__/mockLocalStorage';

beforeEach(() => {
  mockLocalStorage();
});

const mockLoginSuccess = {
  request: {
    query: LOGIN,
    variables: {
      emailOrUsername: 'test@example.com',
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

const mockLoginInvalidCredentials = {
  request: {
    query: LOGIN,
    variables: {
      emailOrUsername: 'wrong@example.com',
      password: 'wrongpassword'
    }
  },
  error: new GraphQLError('Invalid email or password')
};

const mockLoginUserNotExists = {
  request: {
    query: LOGIN,
    variables: {
      emailOrUsername: 'nonexistent@example.com',
      password: 'password123'
    }
  },
  error: new GraphQLError('User does not exist')
};

const networkFailure = Object.assign(new Error('Failed to fetch'), {
  networkError: new Error('Failed to fetch')
});

const mockLoginNetworkError = {
  request: {
    query: LOGIN,
    variables: {
      emailOrUsername: 'test@example.com',
      password: 'password123'
    }
  },
  error: networkFailure
};

describe('LoginForm', () => {
  describe('Form Rendering', () => {
    it('renders all form fields correctly', () => {
      render(
        <MockedProvider mocks={[]}>
          <LoginForm />
        </MockedProvider>
      );

      expect(screen.getByTestId('login-email-input')).toBeInTheDocument();
      expect(screen.getByTestId('login-password-input')).toBeInTheDocument();
      expect(
        screen.getByTestId('login-submit-button')
      ).toBeInTheDocument();
    });

    it('renders the welcome subtitle', () => {
      render(
        <MockedProvider mocks={[]}>
          <LoginForm />
        </MockedProvider>
      );

      expect(
        screen.getByText('Sign in to your account')
      ).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('keeps submit disabled until both fields have a value', async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[]}>
          <LoginForm />
        </MockedProvider>
      );

      const submitButton = screen.getByTestId('login-submit-button');
      expect(submitButton).toBeDisabled();

      await user.type(screen.getByTestId('login-email-input'), 'ada');
      expect(submitButton).toBeDisabled();

      await user.type(screen.getByTestId('login-password-input'), 'password123');
      expect(submitButton).toBeEnabled();
    });

    it('accepts a username that is not an email address', async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[]}>
          <LoginForm />
        </MockedProvider>
      );

      const emailField = screen.getByTestId('login-email-input');
      await user.type(emailField, 'invalid-email');

      expect(emailField).toHaveValue('invalid-email');
      expect(
        screen.queryByText('Please enter a valid email address')
      ).not.toBeInTheDocument();
    });

    it('clears a field error when the user starts typing', async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[mockLoginInvalidCredentials]}>
          <LoginForm />
        </MockedProvider>
      );

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
        expect(
          screen.getByText('Invalid email or password')
        ).toBeInTheDocument();
      });

      await user.type(screen.getByTestId('login-password-input'), 'x');

      await waitFor(() => {
        expect(
          screen.queryByText('Invalid email or password')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Successful Login', () => {
    it('successfully submits the form with valid credentials', async () => {
      const mockOnSuccess = vi.fn();
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[mockLoginSuccess]}>
          <LoginForm onSuccess={mockOnSuccess} />
        </MockedProvider>
      );

      await user.type(screen.getByTestId('login-email-input'), 'test@example.com');
      await user.type(screen.getByTestId('login-password-input'), 'password123');

      const submitButton = screen.getByTestId('login-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledWith({
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
        });
      });

      expect(localStorage.getItem('baphomet-token')).toBe('mock-jwt-token');
    });

    it('clears form errors on successful login', async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[mockLoginSuccess]}>
          <LoginForm />
        </MockedProvider>
      );

      await user.type(screen.getByTestId('login-email-input'), 'test@example.com');
      await user.type(screen.getByTestId('login-password-input'), 'password123');
      await user.click(screen.getByTestId('login-submit-button'));

      await waitFor(() => {
        expect(localStorage.getItem('baphomet-token')).toBe('mock-jwt-token');
      });

      expect(screen.queryByText('Email or username is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles invalid credentials error', async () => {
      const mockOnError = vi.fn();
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[mockLoginInvalidCredentials]}>
          <LoginForm onError={mockOnError} />
        </MockedProvider>
      );

      await user.type(screen.getByTestId('login-email-input'), 'wrong@example.com');
      await user.type(screen.getByTestId('login-password-input'), 'wrongpassword');

      const submitButton = screen.getByTestId('login-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith('Invalid email or password');
      });
    });

    it('handles user does not exist error', async () => {
      const mockOnError = vi.fn();
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[mockLoginUserNotExists]}>
          <LoginForm onError={mockOnError} />
        </MockedProvider>
      );

      await user.type(
        screen.getByTestId('login-email-input'),
        'nonexistent@example.com'
      );
      await user.type(screen.getByTestId('login-password-input'), 'password123');

      const submitButton = screen.getByTestId('login-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith('User does not exist');
      });
    });

    it('handles network errors correctly', async () => {
      const mockOnError = vi.fn();
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[mockLoginNetworkError]}>
          <LoginForm onError={mockOnError} />
        </MockedProvider>
      );

      await user.type(screen.getByTestId('login-email-input'), 'test@example.com');
      await user.type(screen.getByTestId('login-password-input'), 'password123');

      const submitButton = screen.getByTestId('login-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          'Unable to connect to server. Please check your connection and try again.'
        );
      });
    });

    it('shows password-specific errors on the password field', async () => {
      const mockPasswordError = {
        request: {
          query: LOGIN,
          variables: {
            emailOrUsername: 'test@example.com',
            password: 'wrongpassword'
          }
        },
        error: new GraphQLError('Password is incorrect')
      };

      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[mockPasswordError]}>
          <LoginForm />
        </MockedProvider>
      );

      await user.type(screen.getByTestId('login-email-input'), 'test@example.com');
      await user.type(screen.getByTestId('login-password-input'), 'wrongpassword');

      const submitButton = screen.getByTestId('login-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Password is incorrect')).toBeInTheDocument();
      });
    });

    it('shows email-specific errors on the email field', async () => {
      const mockEmailError = {
        request: {
          query: LOGIN,
          variables: {
            emailOrUsername: 'notfound@example.com',
            password: 'password123'
          }
        },
        error: new GraphQLError('User does not exist')
      };

      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[mockEmailError]}>
          <LoginForm />
        </MockedProvider>
      );

      await user.type(screen.getByTestId('login-email-input'), 'notfound@example.com');
      await user.type(screen.getByTestId('login-password-input'), 'password123');

      const submitButton = screen.getByTestId('login-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('User does not exist')).toBeInTheDocument();
      });
    });

    it('shows general error for unspecific errors', async () => {
      const mockGenericError = {
        request: {
          query: LOGIN,
          variables: {
            emailOrUsername: 'test@example.com',
            password: 'password123'
          }
        },
        error: new GraphQLError('Server error')
      };

      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[mockGenericError]}>
          <LoginForm />
        </MockedProvider>
      );

      await user.type(screen.getByTestId('login-email-input'), 'test@example.com');
      await user.type(screen.getByTestId('login-password-input'), 'password123');

      const submitButton = screen.getByTestId('login-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Server error')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('disables form fields and button during submission', async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[mockLoginSuccess]}>
          <LoginForm />
        </MockedProvider>
      );

      await user.type(screen.getByTestId('login-email-input'), 'test@example.com');
      await user.type(screen.getByTestId('login-password-input'), 'password123');

      const submitButton = screen.getByTestId('login-submit-button');
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();

      expect(screen.getByTestId('login-email-input')).toBeDisabled();
      expect(screen.getByTestId('login-password-input')).toBeDisabled();
    });

    it('shows loading text on submit button during submission', async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[mockLoginSuccess]}>
          <LoginForm />
        </MockedProvider>
      );

      await user.type(screen.getByTestId('login-email-input'), 'test@example.com');
      await user.type(screen.getByTestId('login-password-input'), 'password123');

      const submitButton = screen.getByTestId('login-submit-button');
      await user.click(submitButton);

      expect(
        screen.getByRole('button', { name: /signing in, please wait/i })
      ).toBeInTheDocument();
    });
  });
});
