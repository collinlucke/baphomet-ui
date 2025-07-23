import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { InputField } from '@collinlucke/phantomartist';
import { CSSObject } from '@emotion/react';
import { baphColors, baphTypography } from '../styling/baphTheme';
import { SIGNUP } from '../api/mutations';
import { SignupFormData, SignupFormProps, AuthResponse } from '../types/auth.types';

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
    onCompleted: (data) => {
      // Clear any previous errors
      setGeneralError('');
      setErrors({});
      
      // Store token in localStorage
      localStorage.setItem('baphomet-token', data.signup.token);
      
      // Call success callback
      if (onSuccess) {
        onSuccess(data.signup);
      }
    },
    onError: (error) => {
      // Handle different types of errors
      let errorMessage = 'An error occurred during signup';
      
      if (error.networkError) {
        // Network errors (like CORS, server down, etc.)
        errorMessage = 'Unable to connect to server. Please check your connection and try again.';
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
    },
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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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

  const updateField = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Clear general error when user starts typing
    if (generalError) {
      setGeneralError('');
    }
  };

  return (
    <form css={styles.form} onSubmit={handleSubmit}>
      <div css={styles.header}>
        <p css={styles.subtitle}>Join the movie ranking community!</p>
      </div>

      <div css={styles.fields}>
        <InputField
          label="Username"
          value={formData.username}
          onChange={(value: string) => updateField('username', value)}
          placeholder="Enter your username"
          required
          error={errors.username}
          disabled={isLoading}
        />

        <InputField
          label="Display Name"
          value={formData.displayName}
          onChange={(value: string) => updateField('displayName', value)}
          placeholder="How should we display your name?"
          required
          error={errors.displayName}
          disabled={isLoading}
        />

        <InputField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value: string) => updateField('email', value)}
          placeholder="Enter your email address"
          required
          error={errors.email}
          disabled={isLoading}
        />

        <InputField
          label="Password"
          type="password"
          value={formData.password}
          onChange={(value: string) => updateField('password', value)}
          placeholder="Create a secure password"
          required
          error={errors.password}
          disabled={isLoading}
        />

        <InputField
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(value: string) => updateField('confirmPassword', value)}
          placeholder="Confirm your password"
          required
          error={errors.confirmPassword}
          disabled={isLoading}
        />
      </div>

      {generalError && (
        <div css={styles.generalError}>
          {generalError}
        </div>
      )}

      <button css={styles.submitButton} type="submit" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
    width: '100%',
    maxWidth: '400px'
  } as CSSObject,

  header: {
    textAlign: 'center' as const,
    marginBottom: '1rem'
  } as CSSObject,

  title: {
    ...baphTypography.styles.h2,
    margin: '0 0 0.5rem 0',
    color: baphColors.primary
  } as CSSObject,

  subtitle: {
    ...baphTypography.styles.h2,
    margin: 0,
    color: baphColors.primary
  } as CSSObject,

  fields: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    alignItems: 'center'
  } as CSSObject,

  generalError: {
    padding: '0.75rem',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    textAlign: 'center' as const
  } as CSSObject,

  submitButton: {
    ...baphTypography.styles.button,
    padding: '0.75rem 1.5rem',
    backgroundColor: baphColors.primary,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover:not(:disabled)': {
      backgroundColor: '#1e40af'
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed'
    }
  } as CSSObject
};
