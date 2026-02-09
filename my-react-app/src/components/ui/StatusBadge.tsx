import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'pending' | 'in-progress' | 'completed';

interface StatusBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string; // Support custom styles
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ variant = 'default', children, className = '' }) => {
  const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-destructive/10 text-destructive',
    info: 'bg-info/10 text-info',
    pending: 'bg-muted text-muted-foreground',
    'in-progress': 'bg-info/10 text-info',
    completed: 'bg-success/10 text-success',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default StatusBadge;
