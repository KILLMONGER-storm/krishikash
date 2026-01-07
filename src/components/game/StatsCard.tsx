import { ReactNode } from 'react';
import { cn, formatIndianCurrency } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  variant?: 'default' | 'money' | 'savings' | 'debt' | 'stability';
  className?: string;
}

const variantStyles = {
  default: 'bg-card',
  money: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200',
  savings: 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200',
  debt: 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200',
  stability: 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200',
};

const textStyles = {
  default: 'text-foreground',
  money: 'text-amber-700',
  savings: 'text-emerald-700',
  debt: 'text-red-700',
  stability: 'text-blue-700',
};

export const StatsCard = ({ label, value, icon, variant = 'default', className }: StatsCardProps) => {
  return (
    <div className={cn(
      'stat-card animate-scale-in',
      variantStyles[variant],
      className
    )}>
      <div className={cn('text-2xl mb-1', textStyles[variant])}>
        {icon}
      </div>
      <div className={cn('text-lg font-bold', textStyles[variant])}>
        {typeof value === 'number' ? formatIndianCurrency(value) : value}
      </div>
      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
};
