import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("hirecraft_user");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem("hirecraft_user");
      localStorage.removeItem("hirecraft_token");
      return null;
    }
  });

  useEffect(() => {
    if (!localStorage.getItem("hirecraft_token")) return;

    api("/auth/me")
      .then((data) => {
        localStorage.setItem("hirecraft_user", JSON.stringify(data.user));
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("hirecraft_token");
        localStorage.removeItem("hirecraft_user");
        setUser(null);
      });
  }, []);

  async function login(payload) {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    localStorage.setItem("hirecraft_token", data.token);
    localStorage.setItem("hirecraft_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }

  async function register(payload) {
    const data = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    localStorage.setItem("hirecraft_token", data.token);
    localStorage.setItem("hirecraft_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }

  function logout() {
    localStorage.removeItem("hirecraft_token");
    localStorage.removeItem("hirecraft_user");
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, register, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
