import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * useAuth Hook
 *
 * Provides access to the authentication context.
 * Must be used within an AuthProvider.
 *
 * Returns:
 *   - user: { publicId, name, username, role } | null
 *   - isAuthenticated: boolean
 *   - isLoading: boolean (true during initial session restore)
 *   - login(username, password): Promise<user>
 *   - logout(): Promise<void>
 *
 * Usage:
 *   const { user, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;
