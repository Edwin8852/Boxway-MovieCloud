import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    CreditCard,
    Layers,
    AlertCircle,
    MapPin,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/utils/formatters';
import StatusBadge from '@/components/ui/StatusBadge';
import { PageContainer } from '@/components/ui/Layout';
import ProjectPhases from '@/components/projects/ProjectPhases';
import type { PhaseStatus } from '@/types';

const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { projects, clients, staff, updateProject } = useApp();

    const project = useMemo(() =>
        projects.find(p => p.id === id),
        [projects, id]);

    const client = useMemo(() =>
        clients.find(c => c.id === project?.clientId),
        [clients, project]);

    const handleUpdatePhase = async (phaseIndex: number, status: PhaseStatus) => {
        if (!project) return;
        const updatedPhases = [...project.phases];
        updatedPhases[phaseIndex] = { ...updatedPhases[phaseIndex], status };

        // Calculate new progress based on completed phases
        const completedCount = updatedPhases.filter(p => p.status === 'completed').length;
        const newProgress = Math.round((completedCount / updatedPhases.length) * 100);

        await updateProject(project.id, {
            phases: updatedPhases,
            progress: newProgress
        });
    };

    const handleUpdateAllPhases = async (phases: any[], progress: number) => {
        if (!project) return;
        await updateProject(project.id, { phases, progress });
    };

    if (!project) {
        return (
            <PageContainer>
                <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-[2rem] shadow-sm">
                    <AlertCircle className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <h2 className="text-xl font-bold text-foreground">Project Not Found</h2>
                    <p className="text-sm text-muted-foreground mt-2">The blueprint you are looking for does not exist in our archives.</p>
                    <button
                        onClick={() => navigate('/projects')}
                        className="mt-8 btn-primary px-6 h-11"
                    >
                        Return to Portfolio
                    </button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            {/* Immersive Header */}
            <div className="mb-8 lg:mb-12">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">Back to Portfolio</span>
                </button>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8 bg-card border border-border/60 p-5 rounded-[1.5rem] shadow-sm">
                    <div className="flex items-center gap-4">
                        <StatusBadge variant={project.status === 'active' ? 'info' : 'default'} className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                            {project.status}
                        </StatusBadge>
                        <div className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                            PROJECT ID: {project.id.slice(-8).toUpperCase()}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Client:</p>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-black text-[10px]">
                                {client?.name[0]}
                            </div>
                            <h4 className="text-[12px] font-bold text-foreground">{client?.name}</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Intelligence Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

                {/* Left Column: Roadmap & Phases */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                    <div className="bg-card border border-border/60 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none hidden sm:block">
                            <Layers className="w-64 h-64" />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
                            <h3 className="text-xl sm:text-2xl font-display font-black text-foreground tracking-tight">Project Roadmap</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl sm:text-3xl font-display font-black text-primary tabular-nums tracking-tighter">{project.progress}%</span>
                                <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Complete</span>
                            </div>
                        </div>

                        <ProjectPhases
                            project={project}
                            onUpdatePhase={handleUpdatePhase}
                            onUpdateAllPhases={handleUpdateAllPhases}
                        />
                    </div>
                </div>

                {/* Right Column: Key Metrics & Team */}
                <div className="space-y-6 sm:space-y-8">
                    {/* Financials */}
                    <div className="bg-[#1F1F1F] text-white rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-xl overflow-hidden relative">
                        <CreditCard className="absolute bottom-[-20%] right-[-10%] w-48 h-48 opacity-[0.05] -rotate-12 hidden sm:block" />
                        <p className="text-[10px] sm:text-[11px] font-black text-white/40 uppercase tracking-[0.3em] mb-6 sm:mb-8">Financial Overview</p>
                        <div className="space-y-1">
                            <h4 className="text-3xl sm:text-4xl font-display font-black tracking-tighter tabular-nums text-primary">
                                {formatCurrency(project.budget)}
                            </h4>
                            <p className="text-[12px] sm:text-[13px] font-medium text-white/60">Project Budget</p>
                        </div>

                        <div className="mt-8 sm:mt-12 pt-8 sm:pt-10 border-t border-white/5 space-y-4 sm:space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] sm:text-[12px] font-bold text-white/40 uppercase tracking-widest">Invoiced</span>
                                <span className="text-[13px] sm:text-[14px] font-black tabular-nums">{formatCurrency(project.budget * 0.4)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] sm:text-[12px] font-bold text-white/40 uppercase tracking-widest">Outstanding</span>
                                <span className="text-[13px] sm:text-[14px] font-black tabular-nums">{formatCurrency(project.budget * 0.6)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Location & Meta */}
                    <div className="bg-card border border-border/60 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm">
                        <p className="text-[10px] sm:text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-6">Site Metadata</p>
                        <div className="space-y-5 sm:space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-muted flex items-center justify-center text-muted-foreground/40 shrink-0">
                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <div className="min-w-0">
                                    <h5 className="text-[10px] sm:text-[11px] font-black text-muted-foreground uppercase tracking-widest">Execution Location</h5>
                                    <p className="text-sm sm:text-[14px] font-bold text-foreground mt-1 truncate">{client?.siteLocation || 'Confidential Site'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-muted flex items-center justify-center text-muted-foreground/40 shrink-0">
                                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <div className="min-w-0">
                                    <h5 className="text-[10px] sm:text-[11px] font-black text-muted-foreground uppercase tracking-widest">Launch Date</h5>
                                    <p className="text-sm sm:text-[14px] font-bold text-foreground mt-1">
                                        {new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Pulse */}
                    <div className="bg-card border border-border/60 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm">
                        <div className="flex items-center justify-between mb-6 sm:mb-8">
                            <p className="text-[10px] sm:text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em]">Team Pulse</p>
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] sm:text-[9px] font-black uppercase tracking-wider rounded">Active</span>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                            {(project.assignedStaff || []).map((staffId) => {
                                const member = staff.find(s => s.id === staffId);
                                return (
                                    <div key={staffId} className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-muted/30 transition-colors group cursor-pointer">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[9px] sm:text-[10px] font-black text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                                            {member?.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h6 className="text-[12px] sm:text-[13px] font-bold text-foreground truncate">{member?.name}</h6>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium opacity-60 truncate">{member?.role}</p>
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>

            </div>
        </PageContainer>
    );
};

export default ProjectDetail;
