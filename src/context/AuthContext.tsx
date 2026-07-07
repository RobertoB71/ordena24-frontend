import type { ReactNode } from "react";

import { useAuthLogic } from "../hooks/Auth/useAuthLogic";
import { AuthContext } from "./authContextValue";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, token, loading, login, logout } = useAuthLogic();

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
