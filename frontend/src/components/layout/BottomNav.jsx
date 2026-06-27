import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  ArrowLeftRight,
  BarChart3,
} from 'lucide-react';
import { ROUTES } from '../../utils/constants';

/**
 * DS Properties — Bottom Navigation (Mobile)
 *
 * Fixed bottom bar for screens < 768px.
 * 4 tabs: Dashboard, Add Entry (prominent), Transactions, Reports.
 * Settings is accessible from the Header gear icon on mobile.
 */

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: ROUTES.DASHBOARD },
  { label: 'Add', icon: PlusCircle, to: ROUTES.ADD_ENTRY, prominent: true },
  { label: 'Transactions', icon: ArrowLeftRight, to: ROUTES.TRANSACTIONS },
  { label: 'Reports', icon: BarChart3, to: ROUTES.REPORTS },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav
      id="bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-stretch justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to ||
            (item.to !== ROUTES.DASHBOARD && location.pathname.startsWith(item.to));

          return (
            <NavLink
              key={item.to}
              to={item.to}
              id={`bnav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={`
                flex flex-col items-center justify-center flex-1
                text-[10px] font-medium
                transition-colors duration-150
                ${item.prominent ? 'relative' : ''}
                ${isActive
                  ? 'text-primary'
                  : 'text-text-muted'
                }
              `}
            >
              {item.prominent ? (
                /* Prominent "Add" button with raised circle */
                <div className={`
                  flex items-center justify-center
                  w-12 h-12 -mt-4 rounded-full
                  shadow-card-hover
                  transition-all duration-200
                  ${isActive
                    ? 'bg-primary text-white scale-110'
                    : 'bg-primary-light text-white hover:bg-primary'
                  }
                `}>
                  <item.icon size={22} strokeWidth={2} />
                </div>
              ) : (
                <item.icon
                  size={22}
                  className={`mb-0.5 ${isActive ? 'text-primary' : ''}`}
                />
              )}
              <span className={item.prominent ? 'mt-0.5' : ''}>
                {item.label}
              </span>
              {/* Active dot indicator */}
              {isActive && !item.prominent && (
                <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-primary" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
