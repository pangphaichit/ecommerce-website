import React, { createContext, useContext, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/router";

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthContextType {
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  register: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  const register = async (data: RegisterData) => {
    await axios.post("/api/auth/register", data);
    router.push("/register/success");
  };

  const contextValue: AuthContextType = {
    register,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
