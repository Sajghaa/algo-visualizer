import { useCallback, useState } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  setAuthToken,
} from '../api/progressApi';
import type { AuthUser } from '../api/progressApi';

const TOKEN_KEY = 'algovisualizer.token';
const USER_KEY = 'algovisualizer.user';

interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

function loadStoredUser(): AuthUser | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const rawUser = localStorage.getItem(USER_KEY);
  if (!token || !rawUser) return null;

  try {
    const parsed: AuthUser = JSON.parse(rawUser);

    setAuthToken(token);
    return parsed;
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function useAuth(): UseAuthReturn {
  
  const [user, setUser] = useState<AuthUser | null>(loadStoredUser);

  const persist = useCallback((token: string, u: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setAuthToken(token);
    setUser(u);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await apiLogin(email, password);
      persist(res.accessToken, res.user);
      window.location.reload();
    },
    [persist]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      const res = await apiRegister(email, password);
      persist(res.accessToken, res.user);
      window.location.reload();
    },
    [persist]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthToken(null);
    setUser(null);
  }, []);

  return {
    user,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
  };
}