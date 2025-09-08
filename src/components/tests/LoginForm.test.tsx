import '@testing-library/jest-dom';
import { expect, describe, it, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing/react';
import { GraphQLError } from 'graphql';
import { LoginForm } from '../LoginForm';
import { LOGIN } from '../../api/mutations';
import { mockLocalStorage } from '../__mocks__/mockLocalStorage';

beforeEach(() => {
  mockLocalStorage();
});

const mockLoginSuccess = {
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

const mockLoginInvalidCredentials = {
  request: {
    query: LOGIN,
    variables: {
      email: 'wrong@example.com',
      password: 'wrongpassword'
    }
  },
  error: new GraphQLError('Invalid email or password')
};

const mockLoginUserNotExists = {
  request: {
    query: LOGIN,
    variables: {
      email: 'nonexistent@example.com',
      password: 'password123'
    }
  },
  error: new GraphQLError('User does not exist')
};

const mockLoginNetworkError = {
  request: {
    query: LOGIN,
    variables: {
      email: 'test@example.com',
      password: 'password123'
    }
  },
  error: new Error('Network error'),
  networkError: {
    name: 'NetworkError',
    message: 'Network error'
  }
};

describe('LoginForm', () => {
  describe('Form Rendering', () => {
    it('renders all form fields correctly', () => {
      render(
        <MockedProvider mocks={[]}>
          <LoginForm />
        </MockedProvider>
      );

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /log in/i })
      ).toBeInTheDocument();
    });

    it('renders the welcome subtitle', () => {
      render(
        <MockedProvider mocks={[]}>
          <LoginForm />
        </MockedProvider>
      );

      expect(
        screen.getByText('Welcome back to the community!')
      ).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('shows validation errors for empty required fields', async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[]}>
          <LoginForm />
        </MockedProvider>
      );

      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    it('shows error for invalid email format', async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[]}>
          <LoginForm />
        </MockedProvider>
      );

      const emailField = screen.getByLabelText(/email/i);
      await user.type(emailField, 'invalid-email');

      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Please enter a valid email address')
        ).toBeInTheDocument();
      });
    });

    it('clears field errors when user starts typing', async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[]}>
          <LoginForm />
        </MockedProvider>
      );

      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });

      const emailField = screen.getByLabelText(/email/i);
      await user.type(emailField, 'test@');

      await waitFor(() => {
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
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

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');

      const submitButton = screen.getByRole('button', { name: /log in/i });
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

      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
        expect(
          screen.queryByText('Password is required')
        ).not.toBeInTheDocument();
      });
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

      await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword');

      const submitButton = screen.getByRole('button', { name: /log in/i });
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
        screen.getByLabelText(/email/i),
        'nonexistent@example.com'
      );
      await user.type(screen.getByLabelText(/password/i), 'password123');

      const submitButton = screen.getByRole('button', { name: /log in/i });
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

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');

      const submitButton = screen.getByRole('button', { name: /log in/i });
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
            email: 'test@example.com',
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

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'wrongpassword');

      const submitButton = screen.getByRole('button', { name: /log in/i });
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
            email: 'notfound@example.com',
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

      await user.type(screen.getByLabelText(/email/i), 'notfound@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');

      const submitButton = screen.getByRole('button', { name: /log in/i });
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
            email: 'test@example.com',
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

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');

      const submitButton = screen.getByRole('button', { name: /log in/i });
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

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');

      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();

      expect(screen.getByLabelText(/email/i)).toBeDisabled();
      expect(screen.getByLabelText(/password/i)).toBeDisabled();
    });

    it('shows loading text on submit button during submission', async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[mockLoginSuccess]}>
          <LoginForm />
        </MockedProvider>
      );

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/password/i), 'password123');

      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);

      expect(
        screen.getByRole('button', { name: /logging in.../i })
      ).toBeInTheDocument();
    });
  });
});
