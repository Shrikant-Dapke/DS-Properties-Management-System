import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Toast Component
 *
 * Individual toast notification. Auto-dismisses after duration.
 * Types: success (green), error (red), warning (amber), info (blue).
 */

const typeConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-success-50 border-success',
    iconColor: 'text-success',
    textColor: 'text-success-700',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-danger-50 border-danger',
    iconColor: 'text-danger',
    textColor: 'text-danger-700',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-warning-50 border-warning',
    iconColor: 'text-warning',
    textColor: 'text-warning-600',
  },
  info: {
    icon: Info,
    bg: 'bg-primary-50 border-primary-light',
    iconColor: 'text-primary-light',
    textColor: 'text-primary-700',
  },
};

export function Toast({ id, type = 'info', message, duration = 5000, onDismiss }) {
  const [isExiting, setIsExiting] = useState(false);
  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  useEffect(() => {
    if (duration <= 0) return;

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(id), 200);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(id), 200);
  };

  return (
    <div
      role="alert"
      className={`
        flex items-start gap-3 px-4 py-3
        rounded-lg border-l-4 shadow-card
        min-w-[320px] max-w-md
        ${config.bg}
        ${isExiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}
        transition-all duration-200 ease-in-out
        animate-slide-down
      `.trim()}
    >
      <Icon size={20} className={`${config.iconColor} flex-shrink-0 mt-0.5`} />
      <p className={`text-sm font-medium flex-1 ${config.textColor}`}>
        {message}
      </p>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors p-0.5"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}

/**
 * ToastContainer
 *
 * Fixed position container that renders all active toasts.
 */
export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
