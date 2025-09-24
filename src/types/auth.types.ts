export type User = {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  totalVotes: number;
  joinDate: string;
  role: string;
  emailVerified: boolean;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type LoginFormData = {
  emailOrUsername: string; // Changed from 'email' to be more explicit
  password: string;
};

export type SignupFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  firstName: string;
  lastName: string;
  birthday: string;
};

export type LoginFormProps = {
  onSuccess?: (authResponse: AuthResponse) => void;
  onError?: (error: string) => void;
};

export type SignupFormProps = {
  onSuccess?: (authResponse: AuthResponse) => void;
  onError?: (error: string) => void;
};
