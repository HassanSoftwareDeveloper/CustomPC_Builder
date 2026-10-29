import { useState } from "react";
import * as authService from "../services/authService";
import { AuthContext } from "./createAuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.getStoredSession);

  const login = async (credentials) => {
    const loggedInUser = await authService.login(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const signup = async (details) => {
    const newUser = await authService.signup(details);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
