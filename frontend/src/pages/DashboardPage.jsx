import { LayoutDashboard } from 'lucide-react';

/**
 * Dashboard Page — Placeholder
 *
 * Will be built in Phase 2 (Task 21+).
 * Shows a placeholder card indicating the page is under construction.
 */
export default function DashboardPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-surface rounded-2xl shadow-card border border-border p-8 max-w-md w-full text-center space-y-4 animate-scale-in">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-50 mx-auto">
          <LayoutDashboard className="text-primary" size={28} />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Dashboard</h2>
        <p className="text-text-muted text-sm">
          Financial overview will be available here — summary cards, charts, and recent transactions.
        </p>
        <p className="text-text-light text-xs">Coming in Phase 2</p>
      </div>
    </div>
  );
}
