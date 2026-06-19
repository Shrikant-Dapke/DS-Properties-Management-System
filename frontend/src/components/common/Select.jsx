import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Select Component with floating label
 *
 * Accepts options as [{ value, label }]
 */
const Select = forwardRef(function Select(
  {
    label,
    options = [],
    error,
    helperText,
    placeholder = 'Select...',
    disabled = false,
    required = false,
    className = '',
    id,
    value,
    ...props
  },
  ref
) {
  const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  const hasValue = value !== '' && value !== undefined && value !== null;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          value={value}
          className={`
            peer w-full px-4 pt-5 pb-2
            text-text-primary bg-white
            border rounded-lg
            appearance-none cursor-pointer
            transition-all duration-150 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-surface-secondary disabled:text-text-muted disabled:cursor-not-allowed
            pr-10
            ${error
              ? 'border-danger focus:ring-danger-500 focus:border-danger'
              : 'border-border focus:ring-primary-light focus:border-primary-light'
            }
          `.trim()}
          {...props}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {label && (
          <label
            htmlFor={selectId}
            className={`
              absolute left-4
              text-text-muted
              transition-all duration-150 ease-in-out
              pointer-events-none select-none
              ${hasValue
                ? 'top-3 text-xs font-medium'
                : 'top-1/2 -translate-y-1/2 text-base'
              }
              peer-focus:top-3 peer-focus:text-xs peer-focus:font-medium peer-focus:translate-y-0
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
        <ChevronDown
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
      </div>
      {(error || helperText) && (
        <p className={`mt-1.5 text-xs ${error ? 'text-danger' : 'text-text-muted'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

export default Select;
