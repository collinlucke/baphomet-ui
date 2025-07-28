import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { LoginForm } from '../LoginForm';
import { LOGIN } from '../../api/mutations';

const user = userEvent.setup();

describe('LoginForm Tests', () => {
  describe('Form Rendering', () => {
    it('renders all form fields correctly', () => {
      render(
        <MockedProvider mocks={[]}>
          <LoginForm />
        </MockedProvider>
      );

      // Check all input fields are present
      expect(screen.getByTestId('login-email-input')).toBeInTheDocument();
      expect(screen.getByTestId('login-password-input')).toBeInTheDocument();

      // Check submit button
      expect(screen.getByTestId('login-submit-button')).toBeInTheDocument();
    });

    it('renders the form title and subtitle', () => {
      render(
        <MockedProvider mocks={[]}>
          <LoginForm />
        </MockedProvider>
      );

      expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    });
  });

  describe('Form Interaction', () => {
    it('accepts user input in all fields', async () => {
      render(
        <MockedProvider mocks={[]}>
          <LoginForm />
        </MockedProvider>
      );

      const emailInput = screen.getByTestId('login-email-input');
      const passwordInput = screen.getByTestId('login-password-input');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('password123');
    });
  });

  describe('Successful Login', () => {
    it('successfully submits the form with valid credentials', async () => {
      const mockOnSuccess = vi.fn();

      const mocks = [
        {
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
                token: 'fake-jwt-token',
                user: {
                  id: '1',
                  username: 'testuser',
                  email: 'test@example.com',
                  displayName: 'Test User'
                }
              }
            }
          }
        }
      ];

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <LoginForm onSuccess={mockOnSuccess} />
        </MockedProvider>
      );

      // Fill out the form
      await user.type(
        screen.getByTestId('login-email-input'),
        'test@example.com'
      );
      await user.type(
        screen.getByTestId('login-password-input'),
        'password123'
      );

      // Submit the form
      const submitButton = screen.getByTestId('login-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledWith({
          token: 'fake-jwt-token',
          user: {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            displayName: 'Test User'
          }
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('handles invalid credentials error', async () => {
      const mockOnError = vi.fn();

      const mocks = [
        {
          request: {
            query: LOGIN,
            variables: {
              email: 'wrong@example.com',
              password: 'wrongpassword'
            }
          },
          result: {
            errors: [
              {
                message: 'Invalid email or password',
                extensions: { code: 'UNAUTHENTICATED' }
              }
            ]
          }
        }
      ];

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <LoginForm onError={mockOnError} />
        </MockedProvider>
      );

      // Fill out the form with wrong credentials
      await user.type(
        screen.getByTestId('login-email-input'),
        'wrong@example.com'
      );
      await user.type(
        screen.getByTestId('login-password-input'),
        'wrongpassword'
      );

      // Submit the form
      const submitButton = screen.getByTestId('login-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith('Invalid email or password');
      });
    });

    it('shows network error message', async () => {
      const mockOnError = vi.fn();

      const mocks = [
        {
          request: {
            query: LOGIN,
            variables: {
              email: 'test@example.com',
              password: 'password123'
            }
          },
          networkError: new Error('Network error')
        }
      ];

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <LoginForm onError={mockOnError} />
        </MockedProvider>
      );

      // Fill out the form
      await user.type(
        screen.getByTestId('login-email-input'),
        'test@example.com'
      );
      await user.type(
        screen.getByTestId('login-password-input'),
        'password123'
      );

      // Submit the form
      const submitButton = screen.getByTestId('login-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        // Should show the network error message
        expect(
          screen.getByText(
            'Unable to connect to server. Please check your connection and try again.'
          )
        ).toBeInTheDocument();
        expect(mockOnError).toHaveBeenCalledWith(
          'Unable to connect to server. Please check your connection and try again.'
        );
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading state during submission', async () => {
      const mocks = [
        {
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
                token: 'fake-jwt-token',
                user: {
                  id: '1',
                  username: 'testuser',
                  email: 'test@example.com',
                  displayName: 'Test User'
                }
              }
            }
          },
          delay: 100 // Add delay to see loading state
        }
      ];

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <LoginForm />
        </MockedProvider>
      );

      // Fill out the form
      await user.type(
        screen.getByTestId('login-email-input'),
        'test@example.com'
      );
      await user.type(
        screen.getByTestId('login-password-input'),
        'password123'
      );

      // Submit the form
      const submitButton = screen.getByTestId('login-submit-button');
      await user.click(submitButton);

      // Check loading state
      await waitFor(() => {
        expect(screen.getByTestId('login-submit-button')).toBeInTheDocument();
        expect(screen.getByTestId('login-submit-button')).toBeDisabled();
      });
    });
  });

  describe('Form Validation', () => {
    it('prevents submission with empty fields', async () => {
      const mockOnError = vi.fn();
      const mockOnSuccess = vi.fn();

      render(
        <MockedProvider mocks={[]}>
          <LoginForm onError={mockOnError} onSuccess={mockOnSuccess} />
        </MockedProvider>
      );

      const submitButton = screen.getByTestId('login-submit-button');
      await user.click(submitButton);

      // Wait a bit to ensure no GraphQL operations are triggered
      await new Promise(resolve => setTimeout(resolve, 100));

      // No GraphQL operations should have been called due to validation
      expect(mockOnError).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
});
