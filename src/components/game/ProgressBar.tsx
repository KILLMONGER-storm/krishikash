import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'default' | 'stability' | 'savings' | 'debt';
  className?: string;
}

const variantStyles = {
  default: 'bg-primary',
  stability: 'bg-stability',
  savings: 'bg-savings',
  debt: 'bg-debt',
};

export const ProgressBar = ({
  value,
  max = 100,
  label,
  showValue = true,
  variant = 'default',
  className,
}: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-semibold text-foreground">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-bold text-muted-foreground">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className="progress-bar">
        <div
          className={cn('progress-fill', variantStyles[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
