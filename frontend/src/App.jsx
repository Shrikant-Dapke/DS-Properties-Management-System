/**
 * DS Properties — Root Application Component
 *
 * Sets up:
 * - AuthProvider for authentication state
 * - ToastProvider for global notifications
 * - React Router with login and placeholder routes
 *
 * Routes:
 *   /login      → LoginPage (public)
 *   /dashboard  → placeholder (will be built in Task 14+)
 *   /           → redirects to /dashboard
 *   *           → redirects to /dashboard
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import LoadingSpinner from './components/common/LoadingSpinner';
import { ROUTES } from './utils/constants';

/**
 * ProtectedRoute — redirects to login if not authenticated.
 * Full implementation will be in Task 14 (AppLayout with role guards).
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen label="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}

/**
 * DashboardPlaceholder — temporary placeholder until Task 14 builds the real layout.
 */
function DashboardPlaceholder() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-card border border-border p-8 max-w-md w-full text-center space-y-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-success-50 mx-auto">
          <span className="text-2xl">✅</span>
        </div>
        <h1 className="text-xl font-bold text-text-primary">
          Welcome, {user?.name || 'User'}!
        </h1>
        <p className="text-text-muted text-sm">
          You are logged in as <span className="font-semibold text-primary capitalize">{user?.role}</span>.
        </p>
        <p className="text-text-light text-xs">
          Dashboard will be built in upcoming tasks.
        </p>
        <button
          onClick={logout}
          className="mt-4 px-4 py-2 text-sm font-medium text-danger bg-danger-50 rounded-lg hover:bg-danger-100 transition-colors cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <DashboardPlaceholder />
          </ProtectedRoute>
        }
      />
      {/* Redirect root and unmatched routes to dashboard */}
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
