/**
 * Card Component
 *
 * White surface with subtle shadow and rounded corners.
 * Optional header, footer, and padding control.
 */
export default function Card({
  children,
  header,
  footer,
  noPadding = false,
  hover = false,
  className = '',
  ...props
}) {
  return (
    <div
      className={`
        bg-surface rounded-xl shadow-card border border-border
        ${hover ? 'hover:shadow-card-hover transition-shadow duration-200' : ''}
        ${className}
      `.trim()}
      {...props}
    >
      {header && (
        <div className="px-5 py-4 border-b border-border">
          {typeof header === 'string' ? (
            <h3 className="text-base font-semibold text-text-primary">{header}</h3>
          ) : (
            header
          )}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>
        {children}
      </div>
      {footer && (
        <div className="px-5 py-3 border-t border-border bg-surface-secondary rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
}
