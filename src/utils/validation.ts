/**
 * Validation utilities for form inputs
 * Provides reusable validation functions with consistent error messages
 */

export const emailValidation = {
  /**
   * Validates email format using RFC-compliant regex
   * @param email - The email string to validate
   * @returns true if valid, false otherwise
   */
  isValid: (email: string): boolean => {
    if (!email || typeof email !== 'string') return false;
    
    // More comprehensive email regex that handles most valid cases
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    return emailRegex.test(email.trim());
  },

  /**
   * Gets validation error message for email field
   * @param email - The email string to validate
   * @param isRequired - Whether the email field is required
   * @returns Error message string, or empty string if valid
   */
  getMessage: (email: string, isRequired: boolean = false): string => {
    const trimmedEmail = email?.trim() || '';
    
    if (!trimmedEmail) {
      return isRequired ? 'Email address is required' : '';
    }
    
    if (!emailValidation.isValid(trimmedEmail)) {
      return 'Please enter a valid email address';
    }
    
    return '';
  }
};

export const passwordValidation = {
  /**
   * Validates password strength
   * @param password - The password string to validate
   * @returns Object with validation results
   */
  validate: (password: string) => {
    const result = {
      isValid: true,
      messages: [] as string[],
      strength: 'weak' as 'weak' | 'medium' | 'strong'
    };

    if (!password || typeof password !== 'string') {
      result.isValid = false;
      result.messages.push('Password is required');
      return result;
    }

    if (password.length < 8) {
      result.isValid = false;
      result.messages.push('Password must be at least 8 characters long');
    }

    // Check for complexity (optional but recommended)
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const complexityCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (complexityCount >= 3) {
      result.strength = 'strong';
    } else if (complexityCount >= 2) {
      result.strength = 'medium';
    }

    return result;
  },

  /**
   * Simple password validation for login forms
   * @param password - The password string to validate
   * @returns Error message string, or empty string if valid
   */
  getMessage: (password: string): string => {
    if (!password || !password.trim()) {
      return 'Password is required';
    }
    
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    
    return '';
  }
};

export const textValidation = {
  /**
   * Validates required text fields
   * @param value - The text value to validate
   * @param fieldName - Name of the field for error messages
   * @param minLength - Minimum length (optional)
   * @param maxLength - Maximum length (optional)
   * @returns Error message string, or empty string if valid
   */
  getMessage: (
    value: string, 
    fieldName: string, 
    minLength?: number, 
    maxLength?: number
  ): string => {
    const trimmedValue = value?.trim() || '';
    
    if (!trimmedValue) {
      return `${fieldName} is required`;
    }
    
    if (minLength && trimmedValue.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters long`;
    }
    
    if (maxLength && trimmedValue.length > maxLength) {
      return `${fieldName} must be no more than ${maxLength} characters long`;
    }
    
    return '';
  }
};

export const usernameValidation = {
  /**
   * Validates username format and requirements
   * @param username - The username string to validate
   * @returns Error message string, or empty string if valid
   */
  getMessage: (username: string): string => {
    const trimmedUsername = username?.trim() || '';
    
    if (!trimmedUsername) {
      return 'Username is required';
    }
    
    if (trimmedUsername.length < 3) {
      return 'Username must be at least 3 characters long';
    }
    
    if (trimmedUsername.length > 20) {
      return 'Username must be no more than 20 characters long';
    }
    
    // Username can contain letters, numbers, underscores, and hyphens
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      return 'Username can only contain letters, numbers, underscores, and hyphens';
    }
    
    return '';
  }
};

/**
 * Utility to sanitize user input for XSS prevention
 * @param input - The input string to sanitize
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Validates that two password fields match
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns Error message string, or empty string if valid
 */
export const confirmPasswordValidation = (password: string, confirmPassword: string): string => {
  if (!confirmPassword?.trim()) {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return '';
};

// Export a combined validation object for convenience
export const validation = {
  email: emailValidation,
  password: passwordValidation,
  text: textValidation,
  username: usernameValidation,
  confirmPassword: confirmPasswordValidation,
  sanitize: sanitizeInput
};
