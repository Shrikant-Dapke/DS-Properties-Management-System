import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Input Component with floating label
 *
 * Supports: text, number, date, password (with toggle visibility)
 * States: default, focused, error, disabled
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    type = 'text',
    disabled = false,
    required = false,
    className = '',
    id,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          disabled={disabled}
          placeholder=" "
          className={`
            peer w-full px-4 pt-5 pb-2
            text-text-primary bg-white
            border rounded-lg
            transition-all duration-150 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-surface-secondary disabled:text-text-muted disabled:cursor-not-allowed
            ${isPassword ? 'pr-12' : ''}
            ${error
              ? 'border-danger focus:ring-danger-500 focus:border-danger'
              : 'border-border focus:ring-primary-light focus:border-primary-light'
            }
          `.trim()}
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className={`
              absolute left-4 top-1/2 -translate-y-1/2
              text-text-muted text-base
              transition-all duration-150 ease-in-out
              pointer-events-none select-none
              peer-focus:top-3 peer-focus:text-xs peer-focus:font-medium
              peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-medium
              ${error
                ? 'peer-focus:text-danger'
                : 'peer-focus:text-primary-light'
              }
            `.trim()}
          >
            {label}
            {required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors p-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {(error || helperText) && (
        <p className={`mt-1.5 text-xs ${error ? 'text-danger' : 'text-text-muted'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
