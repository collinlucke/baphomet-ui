import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { InputField, Button } from '@collinlucke/phantomartist';
import { CSSObject } from '@emotion/react';
import { LOGIN } from '../api/mutations';
import { LoginFormData, LoginFormProps } from '../types/auth.types';
import { isAuthenticatedVar } from '../reactiveVars';
import { ModalContent } from './ModalContent';
import type { ApolloMutationError } from '../types/CustomTypes.types';

type LoginMutationData = {
  login: {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
      displayName?: string;
      totalVotes: number;
      joinDate: string;
      role: string;
      emailVerified: boolean;
    };
  };
};

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [generalError, setGeneralError] = useState<string>('');

  const [loginMutation, { loading: isLoading, data, error }] =
    useMutation(LOGIN);

  useEffect(() => {
    if (data) {
      const typedData = data as LoginMutationData;
      setGeneralError('');
      setErrors({});

      localStorage.setItem('baphomet-token', typedData.login.token);
      localStorage.setItem(
        'baphomet-user',
        JSON.stringify(typedData.login.user)
      );
      isAuthenticatedVar(true);

      if (onSuccess) {
        onSuccess(typedData.login);
      }
    }
  }, [data, onSuccess]);

  useEffect(() => {
    if (error) {
      const apolloError = error as ApolloMutationError;
      let errorMessage = 'An error occurred during login';

      if (apolloError.networkError) {
        errorMessage =
          'Unable to connect to server. Please check your connection and try again.';
      } else if (
        apolloError.graphQLErrors &&
        apolloError.graphQLErrors.length > 0
      ) {
        errorMessage = apolloError.graphQLErrors[0].message;
      } else if (apolloError.message) {
        errorMessage = apolloError.message;
      }

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
        setGeneralError(errorMessage);
      }

      if (onError) {
        onError(errorMessage);
      }
    }
  }, [error, onError]);

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
      console.error('Login error:', error);
    }
  };

  const updateField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof LoginFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    if (generalError) {
      setGeneralError('');
    }
  };

  return (
    <ModalContent title="Welcome Back!" subtitle="Sign in to your account">
      <form
        css={baphStyles.form}
        onSubmit={handleSubmit}
        data-testid="login-form"
        noValidate
        role="form"
        aria-label="Login form"
      >
        {generalError && (
          <div
            css={baphStyles.errorMessage}
            role="alert"
            aria-live="polite"
            data-testid="login-general-error"
          >
            {generalError}
          </div>
        )}

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
            autoComplete="email"
            ariaDescribedBy={errors.email ? 'email-error' : 'email-help'}
            ariaInvalid={!!errors.email}
            testId="login-email-input"
          />
          <div id="email-help" css={baphStyles.srOnly}>
            Enter the email address associated with your account
          </div>

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
            autoComplete="current-password"
            ariaDescribedBy={
              errors.password ? 'password-error' : 'password-help'
            }
            ariaInvalid={!!errors.password}
            testId="login-password-input"
          />
          <div id="password-help" css={baphStyles.srOnly}>
            Enter your account password
          </div>
        </div>

        <div css={baphStyles.submitContainer}>
          <Button
            type="submit"
            kind="primary"
            size="large"
            disabled={isLoading || !formData.email.trim() || !formData.password}
            ariaLabel={
              isLoading ? 'Signing in, please wait' : 'Sign in to your account'
            }
            testId="login-submit-button"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </div>
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
  fields: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem'
  },
  errorMessage: {
    padding: '0.75rem',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    textAlign: 'center' as const
  },
  submitContainer: {
    marginTop: '0.5rem'
  },
  srOnly: {
    position: 'absolute' as const,
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap' as const,
    border: 0
  }
};
