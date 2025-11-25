import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { RegisterData, LoginFormData, AuthState } from "@/types/context/";

interface AuthContextType {
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginFormData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  userRole: string | null;
  userId: string | null;
  loading: boolean;
  showAlert: (
    message: string,
    type: "success" | "error",
    scope?: "global" | "local"
  ) => void;
  alertOpen: boolean;
  alertMessage: string;
  alertType: "success" | "error";
  alertScope?: "global" | "local";
  closeAlert: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    error: null,
    loading: true,
  });
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertScope, setAlertScope] = useState<"global" | "local">("global");

  const showAlert = (
    message: string,
    type: "success" | "error",
    scope?: "global" | "local"
  ) => {
    const finalScope = scope || "global";
    setAlertMessage(message);
    setAlertType(type);
    setAlertScope(finalScope);
    setAlertOpen(true);

    // Automatically close after 5 seconds
    setTimeout(() => {
      setAlertOpen(false);
      setAlertMessage("");
    }, 5000);
  };

  const closeAlert = () => {
    setAlertOpen(false);
    setAlertMessage("");
    setAlertType("success");
    setAlertScope("global"); // reset to default
  };

  // Check for authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/me", { withCredentials: true });
        const { userId, role } = res.data;

        setState({
          user: { userId, role },
          error: null,
          loading: false,
        });
      } catch (err) {
        setState({ user: null, error: "Not authenticated", loading: false });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (data: LoginFormData) => {
    const { email, password, rememberMe = false } = data;

    const response = await axios.post(
      "/api/auth/log-in",
      { email, password, rememberMe },
      { withCredentials: true }
    );

    const { role, userId } = response.data;

    setState({
      user: { userId, role },
      error: null,
      loading: false,
    });

    showAlert("Login successful!", "success", "global");

    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/customer/my-account");
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    await axios.post("/api/auth/register", data);
    router.push("/register/success");
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post("/api/auth/log-out", {}, { withCredentials: true });

      setState({ user: null, error: null, loading: false });
      showAlert("Log out successful!", "success", "global");
      router.push("/log-in");
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Login failed.";
      showAlert(errorMessage, "error", "global");
      throw err;
    }
  };

  const contextValue: AuthContextType = {
    register,
    login,
    logout,
    isAuthenticated: Boolean(state.user),
    userRole: state.user?.role || null,
    userId: state.user?.userId || null,
    loading: state.loading,
    showAlert,
    alertOpen,
    alertMessage,
    alertType,
    closeAlert,
    alertScope,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Function to create JWT (to be used when creating JWT for login)
const createJWT = (userId: string, role: string) => {
  const secret = process.env.JWT_SECRET; // Get the secret from environment variables

  if (!secret) {
    throw new Error("JWT_SECRET is not defined"); // Error if secret is missing
  }

  const token = jwt.sign({ userId, role }, secret, { expiresIn: "1h" }); // Sign the token
  return token;
};
