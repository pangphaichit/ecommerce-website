export interface ForgotPasswordFormData {
  email: string;
}

export interface ForgotFormErrorState {
  hasError: boolean;
  message: string;
}

export interface ForgotFormTouchedState {
  email: boolean;
}
