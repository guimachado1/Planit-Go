import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { setAuthToken } from '../api/client.js';
import * as authApi from '../api/auth.js';

const AuthContext = createContext(null);

const STORAGE_KEY = 'planit_go_token';

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() =>
    typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  );
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(Boolean(token));

  const setToken = useCallback((t) => {
    setTokenState(t);
    if (t) {
      localStorage.setItem(STORAGE_KEY, t);
      setAuthToken(t);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setAuthToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (token) setAuthToken(token);
    else setAuthToken(null);
  }, [token]);

  useEffect(() => {
    if (!token) {
      setBootstrapping(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const me = await authApi.fetchMe();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) setToken(null);
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, setToken]);

  const login = useCallback(
    async (email, password) => {
      const data = await authApi.login(email, password);
      setToken(data.token);
      setUser(data.user);
      return data;
    },
    [setToken]
  );

  const register = useCallback(
    async (payload) => {
      const data = await authApi.register(payload);
      setToken(data.token);
      setUser(data.user);
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
      user,
      isAuthenticated: Boolean(token),
      bootstrapping,
      login,
      register,
      logout,
    }),
    [token, user, bootstrapping, login, register, logout]
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
