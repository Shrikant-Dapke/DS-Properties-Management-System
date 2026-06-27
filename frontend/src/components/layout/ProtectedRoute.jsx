import { Navigate } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';
import { ROUTES } from '../../utils/constants';

/**
 * ProtectedRoute — Auth + role-based guard wrapper
 *
 * Checks:
 *   1. isAuthenticated — redirects to /login if not
 *   2. user.role — shows "Access Denied" if role not in allowedRoles
 *
 * Usage:
 *   <ProtectedRoute> — any authenticated user
 *   <ProtectedRoute allowedRoles={['admin']}> — admin only
 *   <ProtectedRoute allowedRoles={['admin', 'operator']}> — admin or operator
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Still checking session — show loading
  if (isLoading) {
    return <LoadingSpinner fullScreen label="Loading..." />;
  }

  // Not authenticated — redirect to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Role check — if allowedRoles specified and user's role doesn't match
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl shadow-card border border-border p-8 max-w-md w-full text-center space-y-4 animate-scale-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-danger-50 mx-auto">
            <ShieldX className="text-danger" size={32} />
          </div>
          <h1 className="text-xl font-bold text-text-primary">
            Access Denied
          </h1>
          <p className="text-text-muted text-sm">
            You do not have permission to view this page.
            Contact an administrator if you believe this is an error.
          </p>
          <p className="text-text-light text-xs">
            Required role: <span className="font-semibold capitalize">{allowedRoles.join(', ')}</span>
            {' · '}
            Your role: <span className="font-semibold capitalize">{user?.role}</span>
          </p>
        </div>
      </div>
    );
  }

  return children;
}
