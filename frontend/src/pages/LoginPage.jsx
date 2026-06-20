import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { LogIn, Building2 } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { ROUTES } from '../utils/constants';

/**
 * DS Properties — Login Page
 *
 * Centered login card with DS Properties branding.
 * Handles form validation, error display, and loading state.
 * On success: stores tokens and redirects to /dashboard.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const { toast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  /**
   * Client-side field validation
   */
  function validateFields() {
    const errors = {};
    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    return errors;
  }

  /**
   * Handle form submission
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Client-side validation
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await login(username.trim(), password);
      toast.success('Login successful');
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid username or password';
      setError(message);

      // Show specific feedback for known error types
      if (err.response?.status === 429) {
        setError('Too many login attempts. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-primary-50)_0%,_transparent_50%)] pointer-events-none" />

      <div className="relative w-full max-w-md animate-scale-in">
        {/* Login Card */}
        <div className="bg-surface rounded-2xl shadow-modal border border-border overflow-hidden">
          {/* Branded Header */}
          <div className="bg-gradient-to-br from-primary to-primary-dark px-8 py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm mb-4">
              <Building2 className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              DS Properties
            </h1>
            <p className="text-primary-200 text-sm mt-1">
              Financial Tracking System
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5" noValidate>
            <div className="space-y-4">
              <Input
                id="login-username"
                label="Username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username) {
                    setFieldErrors((prev) => ({ ...prev, username: '' }));
                  }
                  if (error) setError('');
                }}
                error={fieldErrors.username}
                required
                autoComplete="username"
                autoFocus
                disabled={loading}
              />

              <Input
                id="login-password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: '' }));
                  }
                  if (error) setError('');
                }}
                error={fieldErrors.password}
                required
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            {/* Server error message */}
            {error && (
              <div
                className="flex items-center gap-2 p-3 rounded-lg bg-danger-50 border border-danger-100 animate-slide-down"
                role="alert"
                id="login-error-message"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-danger flex-shrink-0" />
                <p className="text-sm text-danger-700 font-medium">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              icon={LogIn}
              id="login-submit-button"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-6 text-center">
            <p className="text-xs text-text-light">
              Authorized personnel only. All activity is logged.
            </p>
          </div>
        </div>

        {/* Version tag */}
        <p className="text-center text-xs text-text-light mt-6">
          DS Properties FTS v1.0
        </p>
      </div>
    </div>
  );
}
