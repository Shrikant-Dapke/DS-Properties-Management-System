import { createContext, useCallback, useState } from 'react';
import { ToastContainer } from '../components/common/Toast';

/**
 * Toast Context
 *
 * Provides a global toast notification system.
 * The useToast hook has been extracted to hooks/useToast.js
 * to satisfy React Fast Refresh (only components in component files).
 *
 * Usage:
 *   import { useToast } from '../hooks/useToast';
 *   const { toast } = useToast();
 *   toast.success('Transaction created');
 */

const ToastContext = createContext(null);

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, duration = 5000) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, type, message, duration }]);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (message, duration) => addToast('success', message, duration),
    error: (message, duration) => addToast('error', message, duration),
    warning: (message, duration) => addToast('warning', message, duration),
    info: (message, duration) => addToast('info', message, duration),
  };

  return (
    <ToastContext.Provider value={{ toast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export default ToastContext;
