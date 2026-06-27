import { PlusCircle } from 'lucide-react';

/**
 * Add Entry Page — Placeholder
 *
 * Will be built in Phase 2 (Task 22+).
 */
export default function AddEntryPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-surface rounded-2xl shadow-card border border-border p-8 max-w-md w-full text-center space-y-4 animate-scale-in">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-success-50 mx-auto">
          <PlusCircle className="text-success" size={28} />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Add Entry</h2>
        <p className="text-text-muted text-sm">
          Create new intake and outtake transaction entries here.
        </p>
        <p className="text-text-light text-xs">Coming in Phase 2</p>
      </div>
    </div>
  );
}
