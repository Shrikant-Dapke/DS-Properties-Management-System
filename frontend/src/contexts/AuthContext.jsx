import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { loginApi, logoutApi, refreshApi } from '../api/authApi';
import {
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearAllTokens,
} from '../api/client';

/**
 * DS Properties — Auth Context
 *
 * Provides authentication state and methods throughout the app:
 *   - user: current user object (publicId, name, username, role)
 *   - isAuthenticated: boolean
 *   - isLoading: true during initial session restore
 *   - login(username, password): authenticate and store tokens
 *   - logout(): revoke tokens and redirect to /login
 *
 * Session persistence:
 *   On app load, checks localStorage for a refresh token and
 *   attempts to restore the session by calling the refresh endpoint.
 */

export const AuthContext = createContext(null);

// User data key for session persistence
const USER_DATA_KEY = 'dsp_user_data';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Attempt to restore session from stored refresh token
   */
  const restoreSession = useCallback(async () => {
    const storedRefreshToken = getRefreshToken();
    if (!storedRefreshToken) {
      setIsLoading(false);
      return;
    }

    try {
      // Try to get a new access token
      const response = await refreshApi(storedRefreshToken);
      const newAccessToken = response.data.accessToken;
      setAccessToken(newAccessToken);

      // Restore user data from localStorage
      const storedUser = localStorage.getItem(USER_DATA_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Refresh failed — clear everything
      clearAllTokens();
      localStorage.removeItem(USER_DATA_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Restore session on mount
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  /**
   * Login with username and password
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Object>} - The user object on success
   * @throws Error on failure
   */
  const login = useCallback(async (username, password) => {
    const response = await loginApi(username, password);
    const { user: userData, accessToken, refreshToken } = response.data;

    // Store tokens
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    // Store user data for session restore
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    setUser(userData);

    return userData;
  }, []);

  /**
   * Logout — revoke refresh token, clear state
   */
  const logout = useCallback(async () => {
    const storedRefreshToken = getRefreshToken();

    try {
      if (storedRefreshToken) {
        await logoutApi(storedRefreshToken);
      }
    } catch {
      // Ignore logout API errors — we're clearing locally regardless
    } finally {
      clearAllTokens();
      localStorage.removeItem(USER_DATA_KEY);
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
