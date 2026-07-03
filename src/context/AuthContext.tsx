import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import type { LoginResponse, User } from "../models/auth";
import { useAuthLogic } from "../hooks/Auth/useAuthLogic";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, token, loading, login, logout } = useAuthLogic();

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };