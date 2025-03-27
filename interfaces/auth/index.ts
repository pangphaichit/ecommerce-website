export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ErrorState {
  hasError: boolean;
  message: string;
}

export interface ValidationChecks {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export interface TouchedState {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
}
