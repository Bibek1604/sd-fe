import { createContext, useContext, useState, useCallback } from 'react';
import config from '../config/env';

const { token: TOKEN_KEY, user: USER_KEY } = config.storageKeys;

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    // A user without a token is a half-cleared session — treat as logged out
    return user && localStorage.getItem(TOKEN_KEY) ? user : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_KEY, authToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
