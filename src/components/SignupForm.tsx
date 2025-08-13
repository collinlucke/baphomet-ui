import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { InputField, Button } from '@collinlucke/phantomartist';
import { CSSObject } from '@emotion/react';
import { baphColors } from '../styling/baphTheme';
import { SIGNUP } from '../api/mutations';
import { SignupFormData, SignupFormProps } from '../types/auth.types';
import { isAuthenticatedVar } from '../reactiveVars';
import { ModalContent } from './ModalContent';

export const SignupForm: React.FC<SignupFormProps> = ({
  onSuccess,
  onError
}) => {
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });

  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [generalError, setGeneralError] = useState<string>('');

  const [signupMutation, { loading: isLoading }] = useMutation(SIGNUP, {
    onCompleted: data => {
      // Clear any previous errors
      setGeneralError('');
      setErrors({});

      // Store token and user data in localStorage
      localStorage.setItem('baphomet-token', data.signup.token);
      localStorage.setItem('baphomet-user', JSON.stringify(data.signup.user));

      // Update authentication state immediately
      isAuthenticatedVar(true);

      // Call success callback
      if (onSuccess) {
        onSuccess(data.signup);
      }
    },
    onError: error => {
      // Handle different types of errors
      let errorMessage = 'An error occurred during signup';

      if (error.networkError) {
        // Network errors (like CORS, server down, etc.)
        errorMessage =
          'Unable to connect to server. Please check your connection and try again.';
      } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        // GraphQL errors (validation, business logic)
        errorMessage = error.graphQLErrors[0].message;
      } else if (error.message) {
        // Other Apollo errors
        errorMessage = error.message;
      }

      // If it's a specific field error, show it on the field
      if (errorMessage.toLowerCase().includes('username')) {
        setErrors(prev => ({ ...prev, username: errorMessage }));
        setGeneralError('');
      } else if (errorMessage.toLowerCase().includes('email')) {
        setErrors(prev => ({ ...prev, email: errorMessage }));
        setGeneralError('');
      } else {
        // Show general error for network issues, server errors, etc.
        setGeneralError(errorMessage);
      }

      // Call error callback
      if (onError) {
        onError(errorMessage);
      }
    }
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupFormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await signupMutation({
        variables: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName || formData.username
        }
      });
    } catch (error) {
      // Error handling is done in the onError callback above
      console.error('Signup error:', error);
    }
  };

  const updateField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (errors[name as keyof SignupFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    // Clear general error when user starts typing
    if (generalError) {
      setGeneralError('');
    }
  };

  return (
    <ModalContent
      title="Create Your Account"
      subtitle="Join the movie ranking community!"
    >
      <form
        css={baphStyles.form}
        onSubmit={handleSubmit}
        noValidate
        data-testid="signup-form"
      >
        <div css={baphStyles.fields}>
          <InputField
            label="Username"
            value={formData.username}
            onChange={updateField}
            placeholder="Enter your username"
            required
            error={errors.username}
            disabled={isLoading}
            data-testid="signup-username-input"
            name="username"
          />

          <InputField
            label="Display Name"
            value={formData.displayName}
            onChange={updateField}
            placeholder="How should we display your name?"
            required
            error={errors.displayName}
            disabled={isLoading}
            data-testid="signup-display-name-input"
            name="displayName"
          />

          <InputField
            label="Email"
            type="email"
            value={formData.email}
            onChange={updateField}
            placeholder="Enter your email address"
            required
            error={errors.email}
            disabled={isLoading}
            data-testid="signup-email-input"
            name="email"
          />

          <InputField
            label="Password"
            type="password"
            value={formData.password}
            onChange={updateField}
            placeholder="Create a secure password"
            required
            error={errors.password}
            disabled={isLoading}
            data-testid="signup-password-input"
            name="password"
          />

          <InputField
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={updateField}
            placeholder="Confirm your password"
            required
            error={errors.confirmPassword}
            disabled={isLoading}
            data-testid="signup-confirm-password-input"
            name="confirmPassword"
          />
        </div>

        {generalError && (
          <div css={baphStyles.generalError} data-testid="signup-general-error">
            {generalError}
          </div>
        )}

        <Button
          type="submit"
          kind="primary"
          disabled={isLoading}
          dataTestId="signup-submit-button"
          className={{ button: baphStyles.signUpButton }}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </ModalContent>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
    width: '100%',
    maxWidth: '400px'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '1rem'
  },
  title: {
    margin: '0 0 0.5rem 0',
    color: baphColors.primary
  },
  subtitle: {
    margin: 0,
    color: baphColors.primary
  },
  fields: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    alignItems: 'center'
  },
  generalError: {
    padding: '0.75rem',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    textAlign: 'center' as const
  },
  signUpButton: {
    justifyContent: 'center',
    width: '100%'
  }
};
