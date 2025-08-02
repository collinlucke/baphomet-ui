import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { InputField, Button } from '@collinlucke/phantomartist';
import { CSSObject } from '@emotion/react';
// import { baphColors, baphTypography } from '../styling/baphTheme';
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
      localStorage.setItem('baphomet-user', JSON.stringify(data.login.user));

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
      console.log(error);

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

  const updateField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    // Clear general error when user starts typing
    if (generalError) {
      setGeneralError('');
    }
  };

  return (
    <form css={baphStyles.form} onSubmit={handleSubmit}>
      <div css={baphStyles.header}>
        <h2 css={baphStyles.title}>Welcome Back!</h2>
        <p css={baphStyles.subtitle}>Sign in to your account</p>
      </div>

      <div css={baphStyles.fields}>
        <InputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={updateField}
          placeholder="Enter your email address"
          required
          error={errors.email}
          disabled={isLoading}
          data-testid="login-email-input"
        />

        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={updateField}
          placeholder="Enter your password"
          required
          error={errors.password}
          disabled={isLoading}
          data-testid="login-password-input"
        />
      </div>

      {generalError && (
        <div css={baphStyles.generalError} data-testid="login-general-error">
          {generalError}
        </div>
      )}

      <Button
        type="submit"
        kind="primary"
        disabled={isLoading}
        dataTestId="login-submit-button"
        className={{ button: baphStyles.logInButton }}
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>

      <div css={baphStyles.footer}>
        <a href="#" css={baphStyles.forgotLink}>
          Forgot your password?
        </a>
      </div>
    </form>
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
    margin: '0 0 0.5rem 0'
  },
  subtitle: {
    margin: 0,
    color: '#6b7280'
  },
  fields: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem'
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
  footer: {
    textAlign: 'center' as const
  },
  forgotLink: {
    textDecoration: 'none',
    fontSize: '0.875rem',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  logInButton: {
    justifyContent: 'center',
    width: '100%'
  }
};
