import { BarChart3 } from 'lucide-react';

/**
 * Reports Page — Placeholder
 *
 * Will be built in Phase 3 (Task 26+).
 */
export default function ReportsPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-surface rounded-2xl shadow-card border border-border p-8 max-w-md w-full text-center space-y-4 animate-scale-in">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-50 mx-auto">
          <BarChart3 className="text-primary-light" size={28} />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Reports</h2>
        <p className="text-text-muted text-sm">
          Generate daily, monthly, and category-wise financial reports.
        </p>
        <p className="text-text-light text-xs">Coming in Phase 3</p>
      </div>
    </div>
  );
}
