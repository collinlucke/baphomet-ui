import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Button, InputField } from '@collinlucke/phantomartist';
import { CSSObject } from '@emotion/react';
import { ModalContent } from './ModalContent';
import { SUBMIT_FEEDBACK } from '../api/mutations';

type FeedbackFormProps = {
  onSuccess: () => void;
};

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    comments: ''
  });
  const [errors, setErrors] = useState<{ email?: string; comments?: string }>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const [submitFeedback] = useMutation(SUBMIT_FEEDBACK, {
    onCompleted: () => {
      setIsSubmitting(false);
      onSuccess();
    },
    onError: error => {
      setIsSubmitting(false);
      setGeneralError('Failed to send feedback. Please try again.');
      console.error('Feedback submission error:', error);
    }
  });

  // Sanitize input to prevent XSS
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim();
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; comments?: string } = {};

    // Validate comments are required
    if (!formData.comments.trim()) {
      newErrors.comments =
        'Comments are required. Please tell us what you think!';
    }

    // Validate email format if provided
    if (formData.email.trim()) {
      newErrors.email = 'Please enter a valid email address or leave it blank.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    // Clear general error when user starts typing
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Sanitize Comments
    const sanitizedComments = sanitizeInput(formData.comments);

    submitFeedback({
      variables: {
        email: formData.email,
        comments: sanitizedComments,
        timestamp: new Date().toISOString()
      }
    });
  };

  return (
    <ModalContent
      title="Send Feedback"
      subtitle="We'd love to hear your thoughts!"
    >
      <form 
        onSubmit={handleSubmit} 
        css={feedbackStyles.form} 
        noValidate
        role="form"
        aria-label="Send feedback form"
      >
        {generalError && (
          <div 
            css={feedbackStyles.errorMessage}
            role="alert"
            aria-live="polite"
            data-testid="feedback-general-error"
          >
            {generalError}
          </div>
        )}

        <InputField
          label="Email Address (Optional)"
          type="email"
          name="email"
          value={formData.email}
          onChange={updateField}
          disabled={isSubmitting}
          error={errors.email}
          helperText="Leave your email if you'd like us to follow up with you."
          autoComplete="email"
          ariaDescribedBy="email-help"
          ariaInvalid={!!errors.email}
          data-testid="feedback-email-input"
        />
        <div id="email-help" css={feedbackStyles.srOnly}>
          Optional: Provide your email if you would like a response to your feedback
        </div>

        <InputField
          label="Comments"
          type="textarea"
          name="comments"
          value={formData.comments}
          onChange={updateField}
          placeholder="Tell us everything..."
          disabled={isSubmitting}
          error={errors.comments}
          required
          ariaDescribedBy="comments-help"
          ariaInvalid={!!errors.comments}
          data-testid="feedback-comments-input"
        />
        <div id="comments-help" css={feedbackStyles.srOnly}>
          Required: Share your thoughts, suggestions, or feedback about the application
        </div>

        <div css={feedbackStyles.submitContainer}>
          <Button 
            type="submit" 
            kind="primary" 
            disabled={isSubmitting || !formData.comments.trim()}
            ariaLabel={isSubmitting ? 'Sending feedback, please wait' : 'Send your feedback'}
            data-testid="feedback-submit-button"
          >
            {isSubmitting ? 'Sending...' : 'Send Feedback'}
          </Button>
        </div>
      </form>
    </ModalContent>
  );
};

const feedbackStyles: { [key: string]: CSSObject } = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  errorMessage: {
    padding: '12px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    fontSize: '0.875rem',
    textAlign: 'center'
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
