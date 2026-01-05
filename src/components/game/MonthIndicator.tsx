import { cn } from '@/lib/utils';

interface MonthIndicatorProps {
  currentMonth: number;
  totalMonths?: number;
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const MonthIndicator = ({ currentMonth, totalMonths = 12 }: MonthIndicatorProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-semibold text-foreground">Year Progress</span>
        <span className="text-sm font-bold text-primary">
          Month {currentMonth} of {totalMonths}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: totalMonths }, (_, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 h-8 rounded-md flex items-center justify-center text-xs font-bold transition-all duration-300',
              i + 1 < currentMonth && 'bg-primary text-primary-foreground',
              i + 1 === currentMonth && 'bg-accent text-accent-foreground animate-pulse-glow',
              i + 1 > currentMonth && 'bg-muted text-muted-foreground'
            )}
          >
            {MONTH_NAMES[i]}
          </div>
        ))}
      </div>
    </div>
  );
};
