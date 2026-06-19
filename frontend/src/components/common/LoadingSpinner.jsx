/**
 * LoadingSpinner Component
 *
 * Spinning circle animation. Sizes: sm, md, lg.
 */
import { Loader2 } from 'lucide-react';

const sizeMap = {
  sm: { icon: 16, text: 'text-xs' },
  md: { icon: 24, text: 'text-sm' },
  lg: { icon: 36, text: 'text-base' },
  xl: { icon: 48, text: 'text-lg' },
};

export default function LoadingSpinner({
  size = 'md',
  label,
  fullScreen = false,
  className = '',
}) {
  const { icon, text } = sizeMap[size] || sizeMap.md;

  const spinner = (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <Loader2
        size={icon}
        className="animate-spin text-primary-light"
      />
      {label && (
        <p className={`${text} text-text-muted font-medium`}>{label}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
