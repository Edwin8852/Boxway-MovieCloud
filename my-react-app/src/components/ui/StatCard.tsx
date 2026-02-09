import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'accent';
  isSeamless?: boolean;
  onClick?: () => void;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  isSeamless = false,
  onClick,
  className = '',
}) => {
  const iconContainerClasses = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary text-primary-foreground',
    accent: 'bg-secondary text-secondary-foreground',
  };

  return (
    <div
      onClick={onClick}
      className={`
      group transition-all duration-300 p-6 sm:p-8 
      ${isSeamless
          ? 'bg-transparent'
          : 'bg-card border border-border rounded-xl hover:shadow-md'
        }
      ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
      ${className}
    `}>
      <div className="flex items-start justify-between gap-4 sm:gap-6">
        <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
          <p className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] truncate">{title}</p>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-foreground tracking-tighter tabular-nums leading-none">
            {value}
          </p>
          {subtitle && (
            <p className="text-[10px] sm:text-xs font-medium text-muted-foreground/70 truncate">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold mt-2 sm:mt-3 ${trend.isPositive ? 'text-success' : 'text-destructive'
              }`}>
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-current/10">
                {trend.isPositive ? '↑' : '↓'}
              </span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="hidden sm:inline text-muted-foreground font-normal ml-0.5 uppercase tracking-wider">Growth</span>
            </div>
          )}
        </div>
        <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shrink-0 ${iconContainerClasses[variant]} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
