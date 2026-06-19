import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

/**
 * ConfirmDialog Component
 *
 * Modal with warning icon, message, cancel + confirm buttons.
 * Confirm button can be danger variant.
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  icon: Icon = AlertTriangle,
}) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showClose={false}
      preventClose={loading}
    >
      <div className="text-center py-2">
        {/* Warning Icon */}
        <div className={`
          inline-flex items-center justify-center w-14 h-14 rounded-full mb-4
          ${variant === 'danger' ? 'bg-danger-50' : 'bg-warning-50'}
        `}>
          <Icon
            size={28}
            className={variant === 'danger' ? 'text-danger' : 'text-warning'}
          />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-sm text-text-muted mb-6 max-w-xs mx-auto">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
