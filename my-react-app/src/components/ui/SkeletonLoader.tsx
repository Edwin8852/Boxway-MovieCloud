

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
    variant?: 'rectangular' | 'circular' | 'text';
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rectangular' }) => {
    const baseClass = "bg-muted/40 relative overflow-hidden";
    const variantClass = variant === 'circular' ? 'rounded-full' : 'rounded-md';

    return (
        <div className={`${baseClass} ${variantClass} ${className}`}>
            <motion.div
                animate={{
                    x: ["-100%", "100%"]
                }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear"
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent"
            />
        </div>
    );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
    <div className="w-full space-y-4">
        <div className="flex gap-4 mb-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-8 flex-1" />)}
        </div>
        {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex gap-4 py-3 border-b border-border/40">
                {[1, 2, 3, 4].map(j => <Skeleton key={j} className="h-4 flex-1" />)}
            </div>
        ))}
    </div>
);

export const SkeletonCard: React.FC = () => (
    <div className="bg-card border border-border/60 rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="pt-4 flex justify-between gap-4">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 flex-1" />
        </div>
    </div>
);

export const SkeletonDetail: React.FC = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
    </div>
);

export default Skeleton;
