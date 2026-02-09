import React from 'react';
import { Bell, Clock, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Project, PayrollRecord } from '@/types';

interface NotificationPopoverProps {
    projects: Project[];
    payroll: PayrollRecord[];
    onClose: () => void;
}

const NotificationPopover: React.FC<NotificationPopoverProps> = ({ projects, payroll, onClose }) => {
    const navigate = useNavigate();

    // Generate notifications
    const notifications = [
        // Upcoming project deadlines (within 30 days)
        ...projects
            .filter(p => p.status === 'active' && p.deadline)
            .filter(p => {
                const diff = new Date(p.deadline).getTime() - new Date().getTime();
                return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
            })
            .map(p => ({
                id: `proj-${p.id}`,
                title: 'Project Deadline',
                message: `${p.name} is due on ${new Date(p.deadline).toLocaleDateString()}`,
                icon: Clock,
                color: 'text-warning',
                onClick: () => {
                    navigate(`/projects/${p.id}`);
                    onClose();
                }
            })),
        // Pending payroll
        ...payroll
            .filter(p => p.status === 'pending')
            .map(p => ({
                id: `pay-${p.id}`,
                title: 'Pending Payroll',
                message: `Salary for ${p.month} ${p.year} is pending approval.`,
                icon: CreditCard,
                color: 'text-info',
                onClick: () => {
                    navigate('/payroll');
                    onClose();
                }
            }))
    ].slice(0, 5); // Show top 5

    return (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
                <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Notifications</h4>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? (
                    <div className="divide-y divide-border/50">
                        {notifications.map((n) => (
                            <button
                                key={n.id}
                                onClick={n.onClick}
                                className="w-full text-left p-4 hover:bg-muted/50 transition-colors group flex gap-3"
                            >
                                <div className={`mt-0.5 p-1.5 rounded-lg bg-muted ${n.color} shrink-0`}>
                                    <n.icon className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <p className="text-[12px] font-bold text-foreground leading-tight">{n.title}</p>
                                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 px-6 text-center">
                        <Bell className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
                        <p className="text-[12px] font-medium text-muted-foreground">All caught up!</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">No new notifications at this moment.</p>
                    </div>
                )}
            </div>

            <div className="p-3 bg-muted/10 border-t border-border text-center">
                <button
                    onClick={onClose}
                    className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
                >
                    Dismiss All
                </button>
            </div>
        </div>
    );
};

export default NotificationPopover;
