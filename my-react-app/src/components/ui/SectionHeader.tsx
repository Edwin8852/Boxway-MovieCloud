import { RotateCw } from 'lucide-react';

interface SectionHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    onRefresh?: () => void;
    className?: string;
    isRefreshing?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    description,
    actions,
    onRefresh,
    className = '',
    isRefreshing = false,
}) => {
    return (
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 ${className}`}>
            <div className="flex-1">
                <div className="flex items-center gap-4">
                    <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#1F1F1F] border-l-2 border-[#6B8E23] pl-6">
                        {title}
                    </h2>
                    {onRefresh && (
                        <button
                            onClick={onRefresh}
                            className={`p-2 rounded-full hover:bg-muted transition-all ${isRefreshing ? 'animate-spin opacity-50' : ''}`}
                            title="Refresh Data"
                        >
                            <RotateCw className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                    )}
                </div>
                {description && (
                    <p className="text-sm text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex items-center gap-3">
                    {actions}
                </div>
            )}
        </div>
    );
};
