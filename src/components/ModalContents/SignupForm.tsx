import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { FormField, Button } from 'athameui';
import { CSSObject } from '@emotion/react';
import { SIGNUP } from '../../api/mutations';
import { SignupFormData, SignupFormProps } from '../../types/auth.types';
import { isAuthenticatedVar } from '../../reactiveVars';
import { ModalContent } from './ModalContent';
import { emailValidation } from '../../utils/validation';
import type { ApolloMutationError } from '../../types/CustomTypes.types';

type SignupMutationData = {
  signup: {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
      displayName?: string;
      firstName?: string;
      lastName?: string;
      birthday?: string;
      totalVotes: number;
      joinDate: string;
      role: string;
      emailVerified: boolean;
    };
  };
};

export const SignupForm = ({ onSuccess, onError }: SignupFormProps) => {
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    firstName: '',
    lastName: '',
    birthday: ''
  });

  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [generalError, setGeneralError] = useState<string>('');

  const [signupMutation, { loading: isLoading, data, error }] =
    useMutation(SIGNUP);

  // Handle successful signup
  useEffect(() => {
    if (data) {
      const typedData = data as SignupMutationData;
      setGeneralError('');
      setErrors({});

      localStorage.setItem('baphomet-token', typedData.signup.token);
      localStorage.setItem(
        'baphomet-user',
        JSON.stringify(typedData.signup.user)
      );

      isAuthenticatedVar(true);

      if (onSuccess) {
        onSuccess(typedData.signup);
      }
    }
  }, [data, onSuccess]);

  // Handle signup errors
  useEffect(() => {
    if (error) {
      const apolloError = error as ApolloMutationError;
      let errorMessage = 'An error occurred during signup';

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

      if (errorMessage.toLowerCase().includes('username')) {
        setErrors(prev => ({ ...prev, username: errorMessage }));
        setGeneralError('');
      } else if (errorMessage.toLowerCase().includes('email')) {
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
    const newErrors: Partial<SignupFormData> = {};
    const emailErrorMessage = emailValidation({
      email: formData.email.trim(),
      isRequired: true
    });

    if (emailErrorMessage) {
      newErrors.email = emailErrorMessage;
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
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
          displayName: formData.displayName || formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthday: formData.birthday
        }
      });
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const updateField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof SignupFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    if (generalError) {
      setGeneralError('');
    }
  };

  return (
    <ModalContent
      title="Create Your Account"
      subtitle="Join the movie ranking community!"
      testId="signup-modal"
    >
      <form
        css={baphStyles.form}
        onSubmit={handleSubmit}
        noValidate
        data-testid="signup-form"
        role="form"
        aria-label="Create account form"
      >
        {generalError && (
          <div
            css={baphStyles.generalError}
            data-testid="signup-general-error"
            role="alert"
            aria-live="polite"
          >
            {generalError}
          </div>
        )}

        <div css={baphStyles.fields}>
          <FormField
            label="Username"
            value={formData.username}
            onChange={updateField}
            placeholder="Enter your username"
            required
            error={errors.username}
            disabled={isLoading}
            data-testid="signup-username-input"
            name="username"
            autoComplete="username"
            aria-describedby="username-help"
            aria-invalid={!!errors.username}
          />
          <div id="username-help" css={baphStyles.srOnly}>
            Choose a unique username for your account, minimum 3 characters
          </div>

          <FormField
            label="Display Name"
            value={formData.displayName}
            onChange={updateField}
            placeholder="If not provided, username will be used"
            error={errors.displayName}
            disabled={isLoading}
            data-testid="signup-display-name-input"
            name="displayName"
            aria-describedby="displayname-help"
            aria-invalid={!!errors.displayName}
          />
          <div id="displayname-help" css={baphStyles.srOnly}>
            Enter the name that will be shown to other users
          </div>

          <FormField
            label="First Name"
            value={formData.firstName}
            onChange={updateField}
            error={errors.firstName}
            disabled={isLoading}
            data-testid="signup-first-name-input"
            name="firstName"
            aria-describedby="firstname-help"
            aria-invalid={!!errors.firstName}
          />
          <div id="firstname-help" css={baphStyles.srOnly}>
            Enter your first name
          </div>

          <FormField
            label="Last Name"
            value={formData.lastName}
            onChange={updateField}
            error={errors.lastName}
            disabled={isLoading}
            data-testid="signup-last-name-input"
            name="lastName"
            aria-describedby="lastname-help"
            aria-invalid={!!errors.lastName}
          />
          <div id="lastname-help" css={baphStyles.srOnly}>
            Enter your last name
          </div>

          <FormField
            label="Birthday"
            value={formData.birthday}
            onChange={updateField}
            type="date"
            error={errors.birthday}
            disabled={isLoading}
            data-testid="signup-birthday-input"
            name="birthday"
            aria-describedby="birthday-help"
            aria-invalid={!!errors.birthday}
          />
          <div id="birthday-help" css={baphStyles.srOnly}>
            Enter your birthday in YYYY-MM-DD format
          </div>

          <FormField
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
            autoComplete="email"
            aria-describedby="email-help"
            aria-invalid={!!errors.email}
          />
          <div id="email-help" css={baphStyles.srOnly}>
            Enter a valid email address for account verification and updates
          </div>

          <FormField
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
            autoComplete="new-password"
            aria-describedby="password-help"
            aria-invalid={!!errors.password}
          />
          <div id="password-help" css={baphStyles.srOnly}>
            Create a secure password with at least 6 characters
          </div>

          <FormField
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
            autoComplete="new-password"
            aria-describedby="confirm-password-help"
            aria-invalid={!!errors.confirmPassword}
          />
          <div id="confirm-password-help" css={baphStyles.srOnly}>
            Re-enter your password to confirm it matches
          </div>
        </div>

        <div css={baphStyles.submitContainer}>
          <Button
            type="submit"
            variant="primary"
            disabled={
              isLoading ||
              !formData.username.trim() ||
              !formData.email.trim() ||
              !formData.password ||
              !formData.confirmPassword ||
              !formData.displayName.trim()
            }
            data-testid="signup-submit-button"
            sx={{ button: baphStyles.signUpButton }}
            aria-label={
              isLoading
                ? 'Creating account, please wait'
                : 'Create your account'
            }
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
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
  submitContainer: {
    marginTop: '0.5rem'
  },
  signUpButton: {
    justifyContent: 'center',
    width: '100%'
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
