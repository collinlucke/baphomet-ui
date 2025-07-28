import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { InputField } from '@collinlucke/phantomartist';
import { CSSObject } from '@emotion/react';
import { baphColors, baphTypography } from '../styling/baphTheme';
import { LOGIN } from '../api/mutations';
import { LoginFormData, LoginFormProps } from '../types/auth.types';

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [generalError, setGeneralError] = useState<string>('');

  const [loginMutation, { loading: isLoading }] = useMutation(LOGIN, {
    onCompleted: data => {
      // Clear any previous errors
      setGeneralError('');
      setErrors({});

      // Store token in localStorage
      localStorage.setItem('baphomet-token', data.login.token);

      // Call success callback
      if (onSuccess) {
        onSuccess(data.login);
      }
    },
    onError: error => {
      // Handle different types of errors
      let errorMessage = 'An error occurred during login';

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
      if (errorMessage.toLowerCase().includes('password')) {
        setErrors(prev => ({ ...prev, password: errorMessage }));
        setGeneralError('');
      } else if (
        errorMessage.toLowerCase().includes('user does not exist') ||
        errorMessage.toLowerCase().includes('email')
      ) {
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
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      await loginMutation({
        variables: {
          email: formData.email,
          password: formData.password
        }
      });
    } catch (error) {
      // Error handling is done in the onError callback above
      console.error('Login error:', error);
    }
  };

  const updateField = (field: keyof LoginFormData, value: string) => {
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
        <h2 css={styles.title}>Welcome Back!</h2>
        <p css={styles.subtitle}>Sign in to your account</p>
      </div>

      <div css={styles.fields}>
        <InputField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value: string) => updateField('email', value)}
          placeholder="Enter your email address"
          required
          error={errors.email}
          disabled={isLoading}
          data-testid="login-email-input"
        />

        <InputField
          label="Password"
          type="password"
          value={formData.password}
          onChange={(value: string) => updateField('password', value)}
          placeholder="Enter your password"
          required
          error={errors.password}
          disabled={isLoading}
          data-testid="login-password-input"
        />
      </div>

      {generalError && (
        <div css={styles.generalError} data-testid="login-general-error">
          {generalError}
        </div>
      )}

      <button
        css={styles.submitButton}
        type="submit"
        disabled={isLoading}
        data-testid="login-submit-button"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>

      <div css={styles.footer}>
        <a href="#" css={styles.forgotLink}>
          Forgot your password?
        </a>
      </div>
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
    ...baphTypography.styles.body,
    margin: 0,
    color: '#6b7280'
  } as CSSObject,

  fields: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem'
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
  } as CSSObject,

  footer: {
    textAlign: 'center' as const
  } as CSSObject,

  forgotLink: {
    ...baphTypography.styles.body,
    color: baphColors.secondary,
    textDecoration: 'none',
    fontSize: '0.875rem',
    '&:hover': {
      textDecoration: 'underline'
    }
  } as CSSObject
};
