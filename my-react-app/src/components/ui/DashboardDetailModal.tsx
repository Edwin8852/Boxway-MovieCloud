import React from 'react';
import Modal from './Modal';
import StatusBadge from './StatusBadge';
import { formatCurrency } from '@/utils/formatters';
import type { Project, Staff, Client, PayrollRecord } from '@/types';
import { Briefcase, Building2, CreditCard, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StaffDetails from './StaffDetails';
import type { PaginationData } from '@/context/AppContext';
import { useApp } from '@/context/AppContext';

interface DashboardDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    type: 'projects' | 'staff' | 'clients' | 'payroll' | null;
    data: any[];
    pagination?: PaginationData;
    statusFilter?: string;
}

const DashboardDetailModal: React.FC<DashboardDetailModalProps> = ({ isOpen, onClose, title, type, data, pagination, statusFilter }) => {
    const navigate = useNavigate();
    const { refreshStaff, refreshClients, refreshProjects, refreshPayroll } = useApp();
    const [viewingItem, setViewingItem] = React.useState<any | null>(null);

    React.useEffect(() => {
        if (!isOpen) {
            setViewingItem(null);
        } else if (statusFilter) {
            // Trigger refresh if we have a specific filter (like pending payroll)
            if (type === 'payroll') refreshPayroll(1, pagination?.limit || 10, '', '', statusFilter);
            if (type === 'projects') refreshProjects(1, pagination?.limit || 10, '', statusFilter);
            if (type === 'staff' && statusFilter !== 'all') refreshStaff(1, pagination?.limit || 10, '', statusFilter);
        }
    }, [isOpen, type, statusFilter]);

    const handleBackToList = () => {
        setViewingItem(null);
    };

    const renderPaginationControls = () => {
        if (!pagination || pagination.pages <= 1) return null;

        const handlePageChange = (newPage: number) => {
            if (type === 'staff') refreshStaff(newPage, pagination.limit);
            if (type === 'clients') refreshClients(newPage, pagination.limit);
            if (type === 'projects') refreshProjects(newPage, pagination.limit);
            if (type === 'payroll') refreshPayroll(newPage, pagination.limit, '', '', statusFilter);
        };

        return (
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/40">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Page {pagination.currentPage} of {pagination.pages}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                        disabled={pagination.currentPage === 1}
                        className="p-1 px-2 rounded bg-black/5 hover:bg-black/10 disabled:opacity-30 text-[11px] font-bold uppercase transition-all"
                    >
                        Prev
                    </button>
                    <button
                        onClick={() => handlePageChange(Math.min(pagination.pages, pagination.currentPage + 1))}
                        disabled={pagination.currentPage === pagination.pages}
                        className="p-1 px-2 rounded bg-black/5 hover:bg-black/10 disabled:opacity-30 text-[11px] font-bold uppercase transition-all"
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (viewingItem && type === 'staff') {
            return (
                <div className="space-y-4">
                    <button
                        onClick={handleBackToList}
                        className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to List
                    </button>
                    <div className="p-2">
                        <StaffDetails staff={viewingItem} />
                    </div>
                </div>
            );
        }

        if (!data || data.length === 0) {
            return (
                <div className="py-20 text-center text-[#1F1F1F]">
                    <p className="text-muted-foreground font-medium">No active records found in this category.</p>
                </div>
            );
        }

        switch (type) {
            case 'projects':
                return (
                    <div className="space-y-3">
                        {data.map((p: Project) => (
                            <div
                                key={p.id}
                                onClick={() => { onClose(); navigate(`/projects/${p.id}`); }}
                                className="group flex items-center justify-between p-3.5 rounded-2xl border border-border/50 bg-white/40 hover:bg-white hover:border-primary/30 transition-all cursor-pointer shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Briefcase className="w-4.5 h-4.5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#1F1F1F] leading-tight">{p.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <StatusBadge variant={p.status === 'active' ? 'info' : 'default'} className="text-[9px] py-0 h-4">{p.status}</StatusBadge>
                                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{p.progress}% Complete</span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        ))}
                        {renderPaginationControls()}
                    </div>
                );

            case 'staff':
                return (
                    <div className="space-y-3">
                        {data.map((s: Staff) => (
                            <div
                                key={s.id}
                                onClick={() => setViewingItem(s)}
                                className="group flex items-center justify-between p-3.5 rounded-2xl border border-border/50 bg-white/40 hover:bg-white hover:border-primary/30 transition-all cursor-pointer shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-[10px]">
                                        {s.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#1F1F1F] leading-tight">{s.name}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-bold font-display">{s.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-bold text-primary/60 uppercase group-hover:text-primary transition-colors">Profile</span>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-colors" />
                                </div>
                            </div>
                        ))}
                        {renderPaginationControls()}
                    </div>
                );

            case 'clients':
                return (
                    <div className="space-y-3">
                        {data.map((c: Client) => (
                            <div
                                key={c.id}
                                onClick={() => { onClose(); navigate('/clients'); }}
                                className="group flex items-center justify-between p-3.5 rounded-2xl border border-border/50 bg-white/40 hover:bg-white hover:border-accent/30 transition-all cursor-pointer shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                        <Building2 className="w-4.5 h-4.5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#1F1F1F] leading-tight">{c.name}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">{c.email}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                            </div>
                        ))}
                        {renderPaginationControls()}
                    </div>
                );

            case 'payroll':
                return (
                    <div className="space-y-3">
                        {data.map((pr: PayrollRecord) => (
                            <div
                                key={pr.id}
                                onClick={() => { onClose(); navigate('/payroll'); }}
                                className="group flex items-center justify-between p-3.5 rounded-2xl border border-border/50 bg-white/40 hover:bg-white hover:border-warning/30 transition-all cursor-pointer shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
                                        <CreditCard className="w-4.5 h-4.5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#1F1F1F] leading-tight">{pr.month} {pr.year}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <StatusBadge variant={pr.status === 'paid' ? 'success' : 'warning'} className="text-[9px] py-0 h-4">{pr.status}</StatusBadge>
                                            <span className="text-[10px] text-muted-foreground font-bold tabular-nums tracking-wider">{formatCurrency(pr.netSalary)}</span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-warning transition-colors" />
                            </div>
                        ))}
                        {renderPaginationControls()}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size={viewingItem ? 'lg' : 'md'}>
            <div className={`p-1 ${viewingItem ? 'max-h-[80vh]' : 'max-h-[60vh]'} overflow-y-auto custom-scrollbar transition-all duration-300`}>
                {renderContent()}
            </div>
        </Modal>
    );
};

export default DashboardDetailModal;
