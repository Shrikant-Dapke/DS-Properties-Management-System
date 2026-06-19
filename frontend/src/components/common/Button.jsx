import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Button Component
 *
 * Variants: primary (blue), success (green), danger (red), outline, ghost
 * Sizes: sm, md, lg
 */
const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary-dark active:bg-primary-900 focus-visible:ring-primary-light',
  success: 'bg-success text-white hover:bg-success-700 active:bg-success-700 focus-visible:ring-success',
  danger: 'bg-danger text-white hover:bg-danger-700 active:bg-danger-700 focus-visible:ring-danger',
  warning: 'bg-warning text-white hover:bg-warning-600 active:bg-warning-600 focus-visible:ring-warning',
  outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-light',
  ghost: 'text-text-secondary bg-transparent hover:bg-surface-secondary active:bg-border focus-visible:ring-primary-light',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        font-medium rounded-lg
        transition-all duration-150 ease-in-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer
        ${variantClasses[variant] || variantClasses.primary}
        ${sizeClasses[size] || sizeClasses.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
      {...props}
    >
      {loading && (
        <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      )}
      {!loading && Icon && iconPosition === 'left' && (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      )}
      {children}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      )}
    </button>
  );
});

export default Button;
