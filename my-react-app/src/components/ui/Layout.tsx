import React from 'react';

/**
 * PageContainer: A standard wrapper for all pages with max-width control
 * Dashboard content uses max-w-[1280px] (defined in MainLayout)
 * Forms and tables use max-w-[1100px]
 */
interface PageContainerProps {
    children: React.ReactNode;
    variant?: 'dashboard' | 'narrow';
    className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
    children,
    className = ''
}) => {
    return (
        <div className={`relative w-full ${className}`}>
            {children}
        </div>
    );
};
