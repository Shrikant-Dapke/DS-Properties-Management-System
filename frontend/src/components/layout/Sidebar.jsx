import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  ArrowLeftRight,
  BarChart3,
  Settings,
  LogOut,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES, ROLES, ROLE_LABELS } from '../../utils/constants';

/**
 * DS Properties — Sidebar Navigation
 *
 * Desktop (≥1024px): Fixed left, 240px wide, full height
 * Tablet (768–1023px): Collapsed sidebar, icons only, 64px wide
 *
 * Features:
 *   - DSP logo/initials at top
 *   - 5 nav items with icons (Settings admin-only)
 *   - Active item highlighted
 *   - User info + logout at bottom
 *   - Collapse/expand toggle on tablet
 */

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: ROUTES.DASHBOARD },
  { label: 'Add Entry', icon: PlusCircle, to: ROUTES.ADD_ENTRY },
  { label: 'Transactions', icon: ArrowLeftRight, to: ROUTES.TRANSACTIONS },
  { label: 'Reports', icon: BarChart3, to: ROUTES.REPORTS },
  { label: 'Settings', icon: Settings, to: ROUTES.SETTINGS, adminOnly: true },
];

export default function Sidebar({ collapsed, onToggleCollapse }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <aside
      id="sidebar"
      className={`
        fixed top-0 left-0 h-full z-30
        bg-surface border-r border-border shadow-sidebar
        flex flex-col
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[var(--sidebar-collapsed-width)]' : 'w-[var(--sidebar-width)]'}
      `}
    >
      {/* ─── Brand Header ─── */}
      <div className={`
        flex items-center gap-3 px-4 h-16 border-b border-border flex-shrink-0
        ${collapsed ? 'justify-center' : ''}
      `}>
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-light flex-shrink-0">
          <Building2 className="text-white" size={20} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden animate-fade-in">
            <h2 className="text-sm font-bold text-text-primary leading-tight truncate">
              DS Properties
            </h2>
            <p className="text-[10px] text-text-light font-medium leading-tight">
              Financial Tracking
            </p>
          </div>
        )}
      </div>

      {/* ─── Navigation Items ─── */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          // Hide admin-only items from non-admin users
          if (item.adminOnly && user?.role !== ROLES.ADMIN) {
            return null;
          }

          const isActive = location.pathname === item.to ||
            (item.to !== ROUTES.DASHBOARD && location.pathname.startsWith(item.to));

          return (
            <NavLink
              key={item.to}
              to={item.to}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              title={collapsed ? item.label : undefined}
              className={`
                group flex items-center gap-3 rounded-lg
                text-sm font-medium
                transition-all duration-150 ease-in-out
                ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
                ${isActive
                  ? 'bg-primary-50 text-primary border border-primary-100'
                  : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary border border-transparent'
                }
              `}
            >
              <item.icon
                size={20}
                className={`flex-shrink-0 transition-colors ${
                  isActive ? 'text-primary' : 'text-text-muted group-hover:text-text-secondary'
                }`}
              />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {/* Active indicator dot for collapsed mode */}
              {collapsed && isActive && (
                <span className="absolute left-0 w-[3px] h-5 rounded-r-full bg-primary" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ─── Collapse Toggle (visible on tablet) ─── */}
      <div className="px-2 py-1 border-t border-border hidden md:block lg:hidden">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center py-2 rounded-lg text-text-muted hover:bg-surface-secondary hover:text-text-secondary transition-colors cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* ─── User Info + Logout ─── */}
      <div className={`
        border-t border-border p-3 flex-shrink-0
        ${collapsed ? 'flex flex-col items-center gap-2' : ''}
      `}>
        {/* User avatar & name */}
        <div className={`flex items-center gap-3 ${collapsed ? 'flex-col' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-[11px] text-text-light capitalize">
                {ROLE_LABELS[user?.role] || user?.role}
              </p>
            </div>
          )}
        </div>

        {/* Logout button */}
        <button
          onClick={logout}
          id="sidebar-logout"
          title="Logout"
          className={`
            flex items-center gap-2 rounded-lg text-sm font-medium
            text-danger hover:bg-danger-50 transition-colors cursor-pointer
            ${collapsed ? 'justify-center p-2 mt-1' : 'w-full px-3 py-2 mt-2'}
          `}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
