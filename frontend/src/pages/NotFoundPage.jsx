import { useNavigate } from 'react-router-dom';
import { Home, SearchX } from 'lucide-react';
import Button from '../components/common/Button';
import { ROUTES } from '../utils/constants';

/**
 * DS Properties — 404 Not Found Page
 *
 * Displayed when no route matches.
 * Provides a link back to the dashboard.
 */
export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="text-center space-y-5 max-w-md animate-scale-in">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-warning-50 mx-auto">
          <SearchX className="text-warning" size={40} />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold text-text-primary">404</h1>
          <h2 className="text-lg font-semibold text-text-secondary">
            Page Not Found
          </h2>
          <p className="text-text-muted text-sm leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Action */}
        <Button
          variant="primary"
          icon={Home}
          onClick={() => navigate(ROUTES.DASHBOARD, { replace: true })}
          id="not-found-home"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
