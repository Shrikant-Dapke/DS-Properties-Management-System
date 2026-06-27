import { Settings } from 'lucide-react';

/**
 * Settings Page — Placeholder (Admin Only)
 *
 * Will be built in Phase 3 (Task 29+).
 */
export default function SettingsPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-surface rounded-2xl shadow-card border border-border p-8 max-w-md w-full text-center space-y-4 animate-scale-in">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-surface-secondary mx-auto">
          <Settings className="text-text-muted" size={28} />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Settings</h2>
        <p className="text-text-muted text-sm">
          Manage users, categories, and system preferences.
        </p>
        <p className="text-text-light text-xs">Coming in Phase 3 · Admin only</p>
      </div>
    </div>
  );
}
