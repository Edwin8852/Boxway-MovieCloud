import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { Project, PhaseStatus } from '@/types';
import { projectPhaseLabels } from '@/utils/mockData';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatCurrency } from '@/utils/formatters';

interface ProjectPhasesProps {
  project: Project;
  onUpdatePhase: (phaseIndex: number, status: PhaseStatus) => void;
  onUpdateAllPhases?: (phases: any[], progress: number) => void;
}

const ProjectPhases: React.FC<ProjectPhasesProps> = ({ project, onUpdatePhase }) => {
  const getPhaseStatusVariant = (status: PhaseStatus) => {
    switch (String(status).toLowerCase()) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'pending': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-8">
      {/* Project Intelligence Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-muted/20 border border-border/60">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-none">Overall Progress</p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground tabular-nums leading-none">{project.progress}%</span>
            <div className="flex-1 h-3 mb-1 bg-muted rounded-full overflow-hidden max-w-[100px]">
              <div
                className={`h-full transition-all duration-1000 ${project.progress > 50 ? 'bg-success' : 'bg-secondary'}`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>
        <div className="p-5 rounded-xl bg-muted/20 border border-border/60">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-none">Milestone Deadline</p>
          <p className="mt-3 text-xl font-bold text-foreground tabular-nums">
            {project.deadline ? new Date(project.deadline).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Setting TBD'}
          </p>
        </div>
        <div className="p-5 rounded-xl bg-muted/20 border border-border/60">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-none">Financial Scope</p>
          <p className="mt-3 text-xl font-bold text-foreground tabular-nums">
            {formatCurrency(project.budget)}
          </p>
        </div>
      </div>

      {/* Operational Roadmap */}
      <div className="space-y-5 relative">
        <div className="flex items-center justify-between">
          <h4 className="text-[14px] font-bold text-foreground uppercase tracking-wider">Project Roadmap</h4>
          <span className="text-[11px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">6 Distinct Stages</span>
        </div>

        <div className="space-y-4 relative">
          <div className="absolute left-7 top-4 bottom-4 w-0.5 bg-border lg:block hidden" />

          {project.phases.map((phase, index) => {
            const currentStatus = String(phase.status).toLowerCase() as PhaseStatus;
            const statusVariant = getPhaseStatusVariant(currentStatus);
            const isActive = currentStatus === 'in-progress';

            return (
              <div
                key={`${phase.phase}-${index}`}
                className={`flex flex-col lg:flex-row lg:items-center gap-4 p-4 rounded-xl border transition-all duration-300 relative z-10 ${isActive
                  ? 'border-secondary/40 bg-secondary/5 shadow-sm'
                  : 'border-border/60 bg-card hover:bg-muted/10'
                  }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-[13px] flex-shrink-0 shadow-sm transition-all duration-500 ${currentStatus === 'completed' ? 'bg-success text-success-foreground' :
                  currentStatus === 'in-progress' ? 'bg-secondary text-white scale-110' :
                    'bg-muted text-muted-foreground'
                  }`}>
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h5 className="font-bold text-foreground text-[14px]">
                      {projectPhaseLabels[phase.phase]}
                    </h5>
                    <StatusBadge variant={statusVariant}>
                      {currentStatus.replace('-', ' ')}
                    </StatusBadge>
                  </div>
                </div>

                <div className="flex items-center gap-3 lg:ml-auto">
                  {isActive && (
                    <div className="flex items-center gap-1.5 mr-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                      </span>
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-widest animate-pulse">Running</span>
                    </div>
                  )}
                  <select
                    value={currentStatus}
                    onChange={(e) => onUpdatePhase(index, e.target.value as PhaseStatus)}
                    className="input-field h-8 text-[12px] font-semibold px-3 py-0 min-w-[130px]"
                  >
                    <option value="pending">Mark Pending</option>
                    <option value="in-progress">Set In-Progress</option>
                    <option value="completed">Complete Phase</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-10">
        <button
          type="button"
          onClick={() => {
            if (confirm('Are you sure you want to mark all phases as completed?')) {
              project.phases.forEach((_, idx) => onUpdatePhase(idx, 'completed'));
            }
          }}
          className="h-10 px-6 text-[13px] font-bold text-muted-foreground hover:text-foreground transition-all hover:bg-muted/50 rounded-lg"
        >
          Finalize All Phases
        </button>
        <button
          type="button"
          onClick={() => {
            const currentIdx = project.phases.findIndex(p => p.status === 'in-progress');
            const nextPendingIdx = project.phases.findIndex(p => p.status === 'pending');

            if (currentIdx !== -1) {
              // Finish current and start next
              onUpdatePhase(currentIdx, 'completed');
              if (nextPendingIdx !== -1) {
                // Use a small timeout or just trigger next. 
                // Since this might cause race conditions with some backends, we do it sequentially.
                setTimeout(() => onUpdatePhase(nextPendingIdx, 'in-progress'), 500);
              }
            } else if (nextPendingIdx !== -1) {
              onUpdatePhase(nextPendingIdx, 'in-progress');
            } else {
              alert('All phases are either completed or in-progress.');
            }
          }}
          className="btn-primary h-10 px-8 text-[13px] font-bold gap-2"
        >
          <span>Initiate Next Phase</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ProjectPhases;
