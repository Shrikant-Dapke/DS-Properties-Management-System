/**
 * DS Properties — Root Application Component
 *
 * Sets up:
 * - AuthProvider for authentication state
 * - ToastProvider for global notifications
 * - React Router with AppLayout and protected routes
 *
 * Routes:
 *   /login         → LoginPage (public)
 *   /dashboard     → DashboardPage (authenticated)
 *   /add-entry     → AddEntryPage (authenticated)
 *   /transactions  → TransactionsPage (authenticated)
 *   /reports       → ReportsPage (authenticated)
 *   /settings      → SettingsPage (admin only)
 *   /              → redirects to /dashboard
 *   *              → NotFoundPage (inside layout)
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// Layout
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddEntryPage from './pages/AddEntryPage';
import TransactionsPage from './pages/TransactionsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Constants
import { ROUTES, ROLES } from './utils/constants';

function AppRoutes() {
  return (
    <Routes>
      {/* Public route */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* Protected routes — wrapped in AppLayout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.ADD_ENTRY} element={<AddEntryPage />} />
        <Route path={ROUTES.TRANSACTIONS} element={<TransactionsPage />} />
        <Route path={ROUTES.TRANSACTION_DETAIL} element={<TransactionsPage />} />
        <Route path={ROUTES.REPORTS} element={<ReportsPage />} />

        {/* Admin-only route */}
        <Route
          path={ROUTES.SETTINGS}
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* 404 — inside the layout so the sidebar stays visible */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
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
