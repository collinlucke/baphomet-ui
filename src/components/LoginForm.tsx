import React, { useState } from 'react';
import { InputField } from '@collinlucke/phantomartist';
import { CSSObject } from '@emotion/react';
import { baphColors, baphTypography } from '../styling/baphTheme';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onSubmit: (formData: LoginFormData) => Promise<void>;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

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
      await onSubmit(formData);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const updateField = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
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
        />
      </div>

      <button css={styles.submitButton} type="submit" disabled={isLoading}>
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
