import { useLocation, useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES, ROLES, ROLE_LABELS } from '../../utils/constants';

/**
 * DS Properties — Header Bar
 *
 * Top bar displaying:
 *   - Page title (derived from current route)
 *   - User avatar and name (desktop/tablet)
 *   - Settings gear icon (mobile — since Settings is not in BottomNav)
 */

const pageTitles = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.ADD_ENTRY]: 'Add Entry',
  [ROUTES.TRANSACTIONS]: 'Transactions',
  [ROUTES.REPORTS]: 'Reports',
  [ROUTES.SETTINGS]: 'Settings',
};

/**
 * Get the page title from the current pathname
 */
function getPageTitle(pathname) {
  // Exact match
  if (pageTitles[pathname]) return pageTitles[pathname];

  // Prefix match (e.g. /transactions/123 → Transactions)
  for (const [route, title] of Object.entries(pageTitles)) {
    if (pathname.startsWith(route) && route !== '/') {
      return title;
    }
  }

  return 'DS Properties';
}

export default function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle = getPageTitle(location.pathname);

  return (
    <header
      id="app-header"
      className="
        sticky top-0 z-20
        bg-surface/95 backdrop-blur-md
        border-b border-border
        h-16 flex items-center justify-between
        px-4 md:px-6
      "
    >
      {/* Left: Page Title */}
      <div>
        <h1 className="text-lg font-bold text-text-primary leading-tight">
          {pageTitle}
        </h1>
      </div>

      {/* Right: User info + mobile settings */}
      <div className="flex items-center gap-3">
        {/* Settings icon — visible only on mobile for non-admin (admin sees in sidebar on desktop) */}
        {user?.role === ROLES.ADMIN && (
          <button
            onClick={() => navigate(ROUTES.SETTINGS)}
            id="header-settings"
            title="Settings"
            className="
              md:hidden
              p-2 rounded-lg
              text-text-muted hover:text-text-secondary hover:bg-surface-secondary
              transition-colors cursor-pointer
            "
          >
            <Settings size={20} />
          </button>
        )}

        {/* User avatar + name (hidden on mobile to save space) */}
        <div className="hidden md:flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-text-primary leading-tight">
              {user?.name || 'User'}
            </p>
            <p className="text-[11px] text-text-light capitalize leading-tight">
              {ROLE_LABELS[user?.role] || user?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
