import { ArrowLeftRight } from 'lucide-react';

/**
 * Transactions Page — Placeholder
 *
 * Will be built in Phase 2 (Task 19+).
 */
export default function TransactionsPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-surface rounded-2xl shadow-card border border-border p-8 max-w-md w-full text-center space-y-4 animate-scale-in">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-warning-50 mx-auto">
          <ArrowLeftRight className="text-warning" size={28} />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Transactions</h2>
        <p className="text-text-muted text-sm">
          View, search, and filter all financial transactions.
        </p>
        <p className="text-text-light text-xs">Coming in Phase 2</p>
      </div>
    </div>
  );
}
