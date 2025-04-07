//api
export interface LoginRequestBody {
  email: string;
  password: string;
  rememberMe?: boolean;
}

//page
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginErrorState {
  hasError: boolean;
  message: string;
}

export interface LoginTouchedState {
  email: boolean;
  password: boolean;
}
