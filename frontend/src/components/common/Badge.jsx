/**
 * Badge Component
 *
 * Pill-shaped status indicator.
 * Variants: intake (green), outtake (red), neutral (gray), warning (amber), info (blue)
 */

const variantClasses = {
  intake: 'bg-success-100 text-success-700',
  outtake: 'bg-danger-100 text-danger-700',
  neutral: 'bg-surface-secondary text-text-muted border border-border',
  warning: 'bg-warning-100 text-warning-600',
  info: 'bg-primary-100 text-primary-700',
  success: 'bg-success-100 text-success-700',
  danger: 'bg-danger-100 text-danger-700',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-medium rounded-full
        whitespace-nowrap
        ${variantClasses[variant] || variantClasses.neutral}
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `.trim()}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          variant === 'intake' || variant === 'success' ? 'bg-success' :
          variant === 'outtake' || variant === 'danger' ? 'bg-danger' :
          variant === 'warning' ? 'bg-warning' :
          variant === 'info' ? 'bg-primary-light' :
          'bg-text-muted'
        }`} />
      )}
      {children}
    </span>
  );
}
