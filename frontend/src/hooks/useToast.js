import { useContext } from 'react';
import ToastContext from '../contexts/ToastContext';

/**
 * useToast Hook
 *
 * Provides access to the toast notification system.
 * Must be used within a ToastProvider.
 *
 * Usage:
 *   const { toast } = useToast();
 *   toast.success('Transaction saved');
 *   toast.error('Something went wrong');
 *   toast.warning('Large amount detected');
 *   toast.info('Session refreshed');
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default useToast;
