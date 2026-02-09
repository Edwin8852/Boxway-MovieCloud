import React from 'react';

interface FormGridProps {
    children: React.ReactNode;
    columns?: 1 | 2 | 3;
    className?: string;
}

export const FormGrid: React.FC<FormGridProps> = ({
    children,
    columns = 2,
    className = '',
}) => {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    };

    return (
        <div className={`grid ${gridCols[columns]} gap-x-4 sm:gap-x-6 gap-y-4 ${className}`}>
            {children}
        </div>
    );
};

interface FormFieldProps {
    label: string;
    children: React.ReactNode;
    error?: string;
    helpText?: string;
    className?: string;
    required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    children,
    error,
    helpText,
    className = '',
    required = false,
}) => {
    return (
        <div className={`space-y-1.5 ${className}`}>
            <label className="text-[10px] font-bold text-[#1F1F1F] uppercase tracking-[0.2em] flex items-center gap-1">
                {label}
                {required && <span className="text-[#CFAE70] font-bold">*</span>}
            </label>
            <div className="relative">
                {children}
            </div>
            {error && (
                <p className="text-xs text-destructive font-medium mt-1">{error}</p>
            )}
            {helpText && !error && (
                <p className="text-xs text-muted-foreground mt-1">{helpText}</p>
            )}
        </div>
    );
};
