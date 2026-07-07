import { useState } from "react";

import type { LoginResponse, User } from "../../models/auth";

const clearStoredSession = () => {
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
};

const getStoredSession = () => {
  const storedUser = sessionStorage.getItem("user");
  const storedToken = sessionStorage.getItem("token");

  if (!storedUser || !storedToken) {
    return { user: null, token: null };
  }

  try {
    const parsedUser: User = JSON.parse(storedUser);

    if (!parsedUser.activo) {
      clearStoredSession();
      return { user: null, token: null };
    }

    return { user: parsedUser, token: storedToken };
  } catch (error) {
    console.error("Error leyendo sesion:", error);
    clearStoredSession();
    return { user: null, token: null };
  }
};

export const useAuthLogic = () => {
  const [storedSession] = useState(getStoredSession);
  const [user, setUser] = useState<User | null>(storedSession.user);
  const [token, setToken] = useState<string | null>(storedSession.token);
  const [loading] = useState(false);

  const logout = () => {
    setUser(null);
    setToken(null);
    clearStoredSession();
  };

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
