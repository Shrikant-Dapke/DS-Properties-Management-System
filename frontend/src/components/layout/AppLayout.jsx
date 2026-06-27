import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Header from './Header';

/**
 * DS Properties — App Layout
 *
 * Responsive layout wrapper for authenticated pages:
 *
 *   Desktop (≥1024px): Full sidebar (240px) + Header + content area
 *   Tablet (768–1023px): Collapsed sidebar (64px icons) + Header + content area
 *   Mobile (<768px): No sidebar + Header + content area + BottomNav
 *
 * Uses CSS media queries for breakpoint detection and adjusts
 * the content area margin/padding accordingly.
 */

/**
 * Custom hook to track the current breakpoint
 */
function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState('desktop');

  useEffect(() => {
    function updateBreakpoint() {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    }

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

export default function AppLayout() {
  const breakpoint = useBreakpoint();
  const [tabletCollapsed, setTabletCollapsed] = useState(true);

  // Determine sidebar state based on breakpoint
  const showSidebar = breakpoint !== 'mobile';
  const sidebarCollapsed = breakpoint === 'tablet' ? tabletCollapsed : false;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar — desktop & tablet only */}
      {showSidebar && (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setTabletCollapsed((prev) => !prev)}
        />
      )}

      {/* Main content area */}
      <div
        className={`
          flex flex-col min-h-screen
          transition-[margin-left] duration-300 ease-in-out
          ${showSidebar
            ? sidebarCollapsed
              ? 'ml-[var(--sidebar-collapsed-width)]'
              : 'ml-[var(--sidebar-width)]'
            : 'ml-0'
          }
        `}
      >
        <Header />

        {/* Page content */}
        <main
          id="main-content"
          className={`
            flex-1 p-4 md:p-6
            animate-fade-in
            ${breakpoint === 'mobile' ? 'pb-24' : ''}
          `}
        >
          <Outlet />
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      {breakpoint === 'mobile' && <BottomNav />}
    </div>
  );
}
