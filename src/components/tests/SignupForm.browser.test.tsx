import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { SignupForm } from '../SignupForm';
import { SIGNUP } from '../../api/mutations';

const user = userEvent.setup();

describe('SignupForm - Realistic Tests', () => {
  describe('Form Rendering', () => {
    it('renders all form fields correctly', () => {
      render(
        <MockedProvider mocks={[]}>
          <SignupForm />
        </MockedProvider>
      );

      // Check all input fields are present
      expect(screen.getByTestId('signup-username-input')).toBeInTheDocument();
      expect(
        screen.getByTestId('signup-display-name-input')
      ).toBeInTheDocument();
      expect(screen.getByTestId('signup-email-input')).toBeInTheDocument();
      expect(screen.getByTestId('signup-password-input')).toBeInTheDocument();
      expect(
        screen.getByTestId('signup-confirm-password-input')
      ).toBeInTheDocument();

      // Check submit button
      expect(screen.getByTestId('signup-submit-button')).toBeInTheDocument();
    });

    it('renders the form subtitle', () => {
      render(
        <MockedProvider mocks={[]}>
          <SignupForm />
        </MockedProvider>
      );

      expect(
        screen.getByText('Join the movie ranking community!')
      ).toBeInTheDocument();
    });
  });

  describe('Form Interaction', () => {
    it('accepts user input in all fields', async () => {
      render(
        <MockedProvider mocks={[]}>
          <SignupForm />
        </MockedProvider>
      );

      const usernameInput = screen.getByTestId('signup-username-input');
      const displayNameInput = screen.getByTestId('signup-display-name-input');
      const emailInput = screen.getByTestId('signup-email-input');
      const passwordInput = screen.getByTestId('signup-password-input');
      const confirmPasswordInput = screen.getByTestId(
        'signup-confirm-password-input'
      );

      await user.type(usernameInput, 'testuser');
      await user.type(displayNameInput, 'Test User');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.type(confirmPasswordInput, 'password123');

      expect(usernameInput).toHaveValue('testuser');
      expect(displayNameInput).toHaveValue('Test User');
      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('password123');
      expect(confirmPasswordInput).toHaveValue('password123');
    });
  });

  describe('Successful Signup', () => {
    it('successfully submits the form with valid data', async () => {
      const mockOnSuccess = vi.fn();

      const mocks = [
        {
          request: {
            query: SIGNUP,
            variables: {
              username: 'testuser',
              email: 'test@example.com',
              password: 'password123',
              displayName: 'Test User'
            }
          },
          result: {
            data: {
              signup: {
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
          <SignupForm onSuccess={mockOnSuccess} />
        </MockedProvider>
      );

      // Fill out the form
      await user.type(screen.getByTestId('signup-username-input'), 'testuser');
      await user.type(
        screen.getByTestId('signup-display-name-input'),
        'Test User'
      );
      await user.type(
        screen.getByTestId('signup-email-input'),
        'test@example.com'
      );
      await user.type(
        screen.getByTestId('signup-password-input'),
        'password123'
      );
      await user.type(
        screen.getByTestId('signup-confirm-password-input'),
        'password123'
      );

      // Submit the form
      const submitButton = screen.getByTestId('signup-submit-button');
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
    it('handles GraphQL errors correctly', async () => {
      const mockOnError = vi.fn();

      const mocks = [
        {
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
            errors: [
              {
                message: 'Username already exists',
                extensions: { code: 'USER_INPUT_ERROR' }
              }
            ]
          }
        }
      ];

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <SignupForm onError={mockOnError} />
        </MockedProvider>
      );

      // Fill out the form with existing user data
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

      // Submit the form
      const submitButton = screen.getByTestId('signup-submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith('Username already exists');
      });
    });

    it('shows network error message', async () => {
      const mockOnError = vi.fn();

      const mocks = [
        {
          request: {
            query: SIGNUP,
            variables: {
              username: 'testuser',
              email: 'test@example.com',
              password: 'password123',
              displayName: 'Test User'
            }
          },
          networkError: new Error('Network error')
        }
      ];

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <SignupForm onError={mockOnError} />
        </MockedProvider>
      );

      // Fill out the form
      await user.type(screen.getByTestId('signup-username-input'), 'testuser');
      await user.type(
        screen.getByTestId('signup-display-name-input'),
        'Test User'
      );
      await user.type(
        screen.getByTestId('signup-email-input'),
        'test@example.com'
      );
      await user.type(
        screen.getByTestId('signup-password-input'),
        'password123'
      );
      await user.type(
        screen.getByTestId('signup-confirm-password-input'),
        'password123'
      );

      // Submit the form
      const submitButton = screen.getByTestId('signup-submit-button');
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
            query: SIGNUP,
            variables: {
              username: 'testuser',
              email: 'test@example.com',
              password: 'password123',
              displayName: 'Test User'
            }
          },
          result: {
            data: {
              signup: {
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
          <SignupForm />
        </MockedProvider>
      );

      // Fill out the form
      await user.type(screen.getByTestId('signup-username-input'), 'testuser');
      await user.type(
        screen.getByTestId('signup-display-name-input'),
        'Test User'
      );
      await user.type(
        screen.getByTestId('signup-email-input'),
        'test@example.com'
      );
      await user.type(
        screen.getByTestId('signup-password-input'),
        'password123'
      );
      await user.type(
        screen.getByTestId('signup-confirm-password-input'),
        'password123'
      );

      // Submit the form
      const submitButton = screen.getByTestId('signup-submit-button');
      await user.click(submitButton);

      // Check loading state
      await waitFor(() => {
        expect(screen.getByTestId('signup-submit-button')).toBeInTheDocument();
        expect(screen.getByTestId('signup-submit-button')).toBeDisabled();
      });
    });
  });

  describe('Form Validation', () => {
    it('prevents submission with empty fields', async () => {
      const mockOnError = vi.fn();
      const mockOnSuccess = vi.fn();

      render(
        <MockedProvider mocks={[]}>
          <SignupForm onError={mockOnError} onSuccess={mockOnSuccess} />
        </MockedProvider>
      );

      const submitButton = screen.getByTestId('signup-submit-button');
      await user.click(submitButton);

      // Wait a bit to ensure no GraphQL operations are triggered
      await new Promise(resolve => setTimeout(resolve, 100));

      // No GraphQL operations should have been called due to validation
      expect(mockOnError).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('prevents submission with mismatched passwords', async () => {
      const mockOnError = vi.fn();
      const mockOnSuccess = vi.fn();

      render(
        <MockedProvider mocks={[]}>
          <SignupForm onError={mockOnError} onSuccess={mockOnSuccess} />
        </MockedProvider>
      );

      // Fill out form with mismatched passwords
      await user.type(screen.getByTestId('signup-username-input'), 'testuser');
      await user.type(
        screen.getByTestId('signup-display-name-input'),
        'Test User'
      );
      await user.type(
        screen.getByTestId('signup-email-input'),
        'test@example.com'
      );
      await user.type(
        screen.getByTestId('signup-password-input'),
        'password123'
      );
      await user.type(
        screen.getByTestId('signup-confirm-password-input'),
        'differentpassword'
      );

      const submitButton = screen.getByTestId('signup-submit-button');
      await user.click(submitButton);

      // Wait a bit to ensure no GraphQL operations are triggered
      await new Promise(resolve => setTimeout(resolve, 100));

      // No GraphQL operations should have been called due to validation
      expect(mockOnError).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
});
