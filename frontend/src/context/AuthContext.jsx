import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import client, { setAuthToken } from '../api/client.js';

const AuthContext = createContext(null);

const STORAGE_KEY = 'planit_go_token';

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() =>
    typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  );

  const setToken = useCallback((t) => {
    setTokenState(t);
    if (t) {
      localStorage.setItem(STORAGE_KEY, t);
      setAuthToken(t);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setAuthToken(null);
    }
  }, []);

  useEffect(() => {
    if (token) setAuthToken(token);
    else setAuthToken(null);
  }, [token]);

  const login = useCallback(
    async (email, password) => {
      const { data } = await client.post('/api/auth/login', { email, password });
      setToken(data.token);
      return data;
    },
    [setToken]
  );

  const register = useCallback(
    async (payload) => {
      const { data } = await client.post('/api/auth/register', payload);
      setToken(data.token);
      return data;
    },
    [setToken]
  );

  const logout = useCallback(() => {
    setToken(null);
  }, [setToken]);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [token, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
