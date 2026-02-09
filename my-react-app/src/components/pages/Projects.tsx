import React, { useState, useMemo } from 'react';
import { Edit, Search, ArrowRight, Clock, Plus } from 'lucide-react';
import api from '@/services/api';
import { useApp } from '@/context/AppContext';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import ProjectForm from '@/components/forms/ProjectForm';
import { projectPhaseLabels } from '@/utils/mockData';
import type { Project, ProjectStatus } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { PageContainer } from '@/components/ui/Layout';
import SearchInput from '@/components/ui/SearchInput';
import { useNavigate } from 'react-router-dom';
import StatCard from '@/components/ui/StatCard';
import { Briefcase, Activity, Target } from 'lucide-react';
import { useLoading } from '@/context/LoadingContext';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';

const Projects: React.FC = () => {
  const { projects, projectPagination, refreshProjects, clients, staff } = useApp();
  const { isApiLoading } = useLoading();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const stats = useMemo(() => {
    return {
      total: projectPagination.total || projects.length,
      active: projects.filter(p => p.status === 'active').length,
      planning: projects.filter(p => p.status === 'planning').length
    };
  }, [projects, projectPagination]);

  // Debounced search effect
  React.useEffect(() => {
    const timer = setTimeout(() => {
      refreshProjects(1, projectPagination.limit, search, statusFilter);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Status filter effect
  React.useEffect(() => {
    refreshProjects(1, projectPagination.limit, search, statusFilter);
  }, [statusFilter]);

  const filteredProjects = projects; // Now handled server-side


  const handleAddProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = async (data: any) => {
    setIsSaving(true);
    try {
      const payload = {
        ...data,
        client: data.clientId, // Map clientId to client for backend
      };

      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      refreshProjects();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Ensure all fields are valid.');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadgeVariant = (status: ProjectStatus) => {
    switch (status) {
      case 'active': return 'info';
      case 'completed': return 'success';
      case 'on-hold': return 'warning';
      case 'planning': return 'default';
      default: return 'default';
    }
  };

  const getClientName = (clientId: string) => {
    return clients.find(c => c.id === clientId)?.name || 'Unknown Client';
  };

  return (
    <PageContainer variant="dashboard">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-black text-foreground tracking-tighter leading-tight">Project Portfolio</h2>
          <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-2">
            Monitoring {projects?.length || 0} architectural projects across various delivery stages.
          </p>
        </div>
        <button onClick={handleAddProject} className="btn-primary gap-2 h-11 px-6 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-[0.98]">
          <Plus className="w-4 h-4" />
          <span className="font-black text-[11px] uppercase tracking-[0.2em]">Add Project</span>
        </button>
      </div>

      {/* Extreme Stats Grid */}
      <div className="bg-card border border-border/60 rounded-[1.5rem] sm:rounded-[2rem] shadow-xl overflow-hidden mb-8 sm:mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
          <StatCard
            title="Total Ventures"
            value={stats.total}
            icon={Briefcase}
            isSeamless
          />
          <StatCard
            title="In Production"
            value={stats.active}
            icon={Activity}
            variant="primary"
            isSeamless
          />
          <StatCard
            title="Blueprint Stage"
            value={stats.planning}
            icon={Target}
            variant="accent"
            isSeamless
          />
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-xl p-3 sm:p-4 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search portfolio..."
            className="flex-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-full sm:w-48 md:w-52 h-10 text-xs sm:text-sm"
          >
            <option value="all">All Stages</option>
            <option value="planning">Initial Planning</option>
            <option value="active">Active Execution</option>
            <option value="on-hold">On-Hold / Paused</option>
            <option value="completed">Successfully Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        {isApiLoading && projects.length === 0 ? (
          [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
        ) : (
          filteredProjects.map((project) => {
            if (!project) return null;
            const currentPhase = (project.phases || []).find(p => p.status === 'in-progress');
            return (
              <div
                key={project.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col group cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                {/* ... existing card content ... */}
                <div className="p-5 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="text-base font-bold text-foreground leading-tight group-hover:text-primary transition-colors truncate">
                        {project.name}
                      </h3>
                      <p className="text-[12px] text-muted-foreground font-medium mt-1">
                        {getClientName(project.clientId)}
                      </p>
                    </div>
                    <StatusBadge variant={getStatusBadgeVariant(project.status)}>
                      {project.status}
                    </StatusBadge>
                  </div>

                  <p className="text-[13px] text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Current Progress
                      </span>
                      <span className="text-foreground tabular-nums">{project.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${project.progress > 70 ? 'bg-success' : project.progress > 30 ? 'bg-primary' : 'bg-warning'
                          }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-border/80">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold leading-none">Active Phase</p>
                      <p className="text-[13px] font-semibold text-foreground truncate">
                        {currentPhase ? projectPhaseLabels[currentPhase.phase] : 'Not Started'}
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold leading-none">Budget</p>
                      <p className="text-[13px] font-bold text-foreground tabular-nums">
                        {formatCurrency(project.budget)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 bg-muted/30 border-t border-border flex items-center justify-between group-hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1.5">
                      {(project.assignedStaff || []).slice(0, 3).map((staffId) => (
                        <div key={staffId} className="w-6 h-6 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-[9px] font-bold text-primary">
                          {staff.find(s => s.id === staffId)?.name?.[0] || '?'}
                        </div>
                      ))}
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {(project.assignedStaff || []).length} Team Members
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProject(project);
                      }}
                      className="p-1.5 rounded-md hover:bg-card-elevated text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button className="flex items-center gap-2 text-[11px] font-bold text-primary group/btn">
                      <span>View Roadmap</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer */}
      {projectPagination.pages > 1 && (
        <div className="mt-8 px-6 py-4 bg-card border border-border/60 rounded-xl flex items-center justify-between">
          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            Total {projectPagination.total} Ventures • Page {projectPagination.currentPage} of {projectPagination.pages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => refreshProjects(Math.max(1, projectPagination.currentPage - 1), projectPagination.limit, search, statusFilter)}
              disabled={projectPagination.currentPage === 1}
              className="p-2 rounded-lg bg-card border border-border text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button
              onClick={() => refreshProjects(Math.min(projectPagination.pages, projectPagination.currentPage + 1), projectPagination.limit, search, statusFilter)}
              disabled={projectPagination.currentPage === projectPagination.pages}
              className="p-2 rounded-lg bg-card border border-border text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        </div>
      )}
      {filteredProjects.length === 0 && (
        <div className="text-center py-20 bg-muted/10 rounded-2xl border-2 border-dashed border-border">
          <div className="w-12 h-12 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-muted-foreground/40" />
          </div>
          <h4 className="text-sm font-bold text-foreground">No projects found</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-[200px] mx-auto">Try adjusting your search filters to find what you're looking for.</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project Plan' : 'Initiate New Project'}
        size="lg"
      >
        <ProjectForm
          initialData={editingProject || undefined}
          clients={clients}
          staff={staff}
          onSubmit={handleSaveProject}
          onCancel={() => setIsModalOpen(false)}
          isSaving={isSaving}
        />
      </Modal>

    </PageContainer >
  );
};

export default Projects;
