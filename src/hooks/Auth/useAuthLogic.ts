import { useEffect, useState } from "react";
import type { LoginResponse, User } from "../../models/auth";
export const useAuthLogic = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("token");

    try {
      if (storedUser && storedToken) {
        const parsedUser: User = JSON.parse(storedUser);

        if (!parsedUser.activo) {
          logout();
          return;
        }

        setUser(parsedUser);
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Error leyendo sesión:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (data: LoginResponse) => {
    setUser(data.usuario);
    setToken(data.access_token);

    sessionStorage.setItem("user", JSON.stringify(data.usuario));
    sessionStorage.setItem("token", data.access_token);
  };

  return {
    user,
    token,
    loading,
    login,
    logout,
  };
};