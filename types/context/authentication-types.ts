export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserData {
  role: string;
  userId: string;
}

export interface AuthState {
  user: UserData | null;
  error: string | null;
  loading: boolean;
}

export interface AuthContextType {
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginFormData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  userRole: string | null;
  userId: string | null;
  loading: boolean;
}
