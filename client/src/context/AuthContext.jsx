// ============================================================
// context/AuthContext.jsx — Global authentication state
// ============================================================
// Wraps the app so any component can access the current user
// and call login/logout without prop drilling.
// ============================================================

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Try to restore user session from localStorage on first load
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("vault_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("vault_token") || null);

  // Persist user/token to localStorage whenever they change
  useEffect(() => {
    if (user && token) {
      localStorage.setItem("vault_user", JSON.stringify(user));
      localStorage.setItem("vault_token", token);
    }
  }, [user, token]);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("vault_user", JSON.stringify(userData));
    localStorage.setItem("vault_token", jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("vault_user");
    localStorage.removeItem("vault_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — components call useAuth() instead of useContext(AuthContext)
export const useAuth = () => useContext(AuthContext);
