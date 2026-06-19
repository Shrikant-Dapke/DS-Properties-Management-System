/**
 * SkeletonLoader Component
 *
 * Shimmer animation placeholders for loading states.
 * Shapes: text (line), card (rectangle), circle, avatar.
 */

export function SkeletonLine({ width = '100%', height = '1rem', className = '' }) {
  return (
    <div
      className={`skeleton rounded ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-surface rounded-xl border border-border p-5 ${className}`}>
      <SkeletonLine width="60%" height="1.25rem" className="mb-3" />
      <SkeletonLine width="40%" height="2rem" className="mb-4" />
      <SkeletonLine width="80%" height="0.875rem" />
    </div>
  );
}

export function SkeletonCircle({ size = 40, className = '' }) {
  return (
    <div
      className={`skeleton rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function SkeletonRow({ className = '' }) {
  return (
    <div className={`flex items-center gap-4 p-4 ${className}`}>
      <SkeletonCircle size={36} />
      <div className="flex-1 space-y-2">
        <SkeletonLine width="50%" height="0.875rem" />
        <SkeletonLine width="30%" height="0.75rem" />
      </div>
      <SkeletonLine width="80px" height="1rem" />
    </div>
  );
}

export default function SkeletonLoader({ rows = 5, type = 'row', className = '' }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        type === 'card' ? <SkeletonCard key={i} /> : <SkeletonRow key={i} />
      ))}
    </div>
  );
}
