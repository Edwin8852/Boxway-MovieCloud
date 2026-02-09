import React from 'react';
import {
  Building2,
  Users,
  Briefcase,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { projectPhaseLabels } from '@/utils/mockData';
import { PageContainer } from '@/components/ui/Layout';
import { SectionHeader } from '@/components/ui/SectionHeader';
import DashboardDetailModal from '@/components/ui/DashboardDetailModal';
import ClockAndCalendar from '@/components/ui/ClockAndCalendar';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { staff, staffPagination, clients, clientPagination, projects, projectPagination, payroll, payrollPagination } = useApp();
  const navigate = useNavigate();

  const [detailModal, setDetailModal] = React.useState<{
    isOpen: boolean;
    title: string;
    type: 'projects' | 'staff' | 'clients' | 'payroll' | null;
    statusFilter?: string;
  }>({
    isOpen: false,
    title: '',
    type: null,
    statusFilter: undefined
  });

  const openDetail = (title: string, type: 'projects' | 'staff' | 'clients' | 'payroll', statusFilter?: string) => {
    setDetailModal({ isOpen: true, title, type, statusFilter });
  };

  const isAdmin = user?.role === 'admin';
  const isStaff = !isAdmin;

  const projectList = Array.isArray(projects) ? projects : [];
  const clientList = Array.isArray(clients) ? clients : [];
  const staffList = Array.isArray(staff) ? staff : [];
  const payrollList = Array.isArray(payroll) ? payroll : [];

  // Admin Stats - FIXED: Use total records from pagination
  const activeProjects = projectList.filter(p => p?.status === 'active').length; // Local filter for active
  const totalClients = clientPagination.total || clientList.length;
  const totalStaff = staffPagination.total || staffList.length;
  const totalProjects = projectPagination.total || projectList.length;
  const pendingPayroll = payrollPagination.total || payrollList.filter(p => p?.status === 'pending').length;

  // Staff's assigned projects
  const assignedProjects = projectList.filter(p =>
    (p?.assignedStaff || []).includes(user?.id || '')
  );

  // Upcoming deadlines
  const upcomingDeadlines = projectList
    .filter(p => p?.status === 'active' && p?.deadline)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  return (
    <PageContainer>
      {/* Hero Section & Quick Actions */}
      <div className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        <div>
          <h2 className="text-3xl font-display font-black text-foreground tracking-tighter leading-tight">
            Welcome back, {user?.name.split(' ')[0] || 'User'}!
          </h2>
          <p className="text-[13px] font-medium text-muted-foreground mt-2 flex items-center gap-2">
            Managing {isAdmin ? 'global organization operations' : 'assigned project portfolios'} today.
          </p>
        </div>
        <div className="flex xl:justify-end">
          <ClockAndCalendar />
        </div>
      </div>

      {/* Admin Dashboard - Extreme Overhaul */}
      {isAdmin && (
        <div className="space-y-6 sm:space-y-10">
          {/* Seamless Stats Command Center */}
          <div className="bg-card border border-border/60 rounded-[1.5rem] sm:rounded-[2rem] shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
              <StatCard
                title="Total Projects"
                value={totalProjects}
                subtitle={`${activeProjects} active execution`}
                icon={Building2}
                variant="primary"
                trend={{ value: 12, isPositive: true }}
                isSeamless
                onClick={() => openDetail('Company Projects Portfolio', 'projects')}
              />
              <StatCard
                title="Active Clients"
                value={totalClients}
                subtitle="Primary partnerships"
                icon={Briefcase}
                variant="accent"
                isSeamless
                onClick={() => openDetail('Global Client Network', 'clients')}
              />
              <StatCard
                title="Staff Members"
                value={totalStaff}
                subtitle={`${staffList.filter(s => s?.role === 'architect').length} lead architects`}
                icon={Users}
                isSeamless
                onClick={() => openDetail('Arch-Force Professional Staff', 'staff')}
              />
              <StatCard
                title="Pending Payroll"
                value={pendingPayroll}
                subtitle="Payouts in queue"
                icon={CreditCard}
                variant={pendingPayroll > 0 ? 'accent' : 'default'}
                isSeamless
                onClick={() => openDetail('Pending Payroll Cycles', 'payroll', 'pending')}
              />
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Project Status Overview */}
            <div className="bg-card border border-border/60 rounded-[1.2rem] sm:rounded-[1.5rem] p-6 sm:p-8 shadow-sm lg:col-span-2">
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">Architectural Workflow</h3>
                <p className="text-[11px] sm:text-[12px] text-muted-foreground mt-1">Status distribution across the project lifecycle.</p>
              </div>
              <div className="space-y-5 sm:space-y-6">
                {[
                  { label: 'Planning', count: projectList.filter(p => p?.status === 'planning').length, color: 'bg-muted-foreground/20' },
                  { label: 'Active', count: projectList.filter(p => p?.status === 'active').length, color: 'bg-info' },
                  { label: 'On Hold', count: projectList.filter(p => p?.status === 'on-hold').length, color: 'bg-warning' },
                  { label: 'Completed', count: projectList.filter(p => p?.status === 'completed').length, color: 'bg-success' },
                ].map((status) => (
                  <div key={status.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${status.color}`} />
                        <span className="text-foreground font-medium">{status.label}</span>
                      </div>
                      <span className="text-muted-foreground">{status.count} projects</span>
                    </div>
                    <div className="w-full h-1 sm:h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${status.color} rounded-full transition-all duration-700 ease-in-out`}
                        style={{ width: `${projects.length > 0 ? (status.count / projects.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-card border border-border/60 rounded-[1.2rem] sm:rounded-[1.5rem] p-6 sm:p-8 shadow-sm">
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">Upcoming Milestones</h3>
                <p className="text-[11px] sm:text-[12px] text-muted-foreground mt-1">Critical delivery dates in the next 30 days.</p>
              </div>
              <div className="space-y-1">
                {upcomingDeadlines.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="flex items-center gap-3 sm:gap-4 p-3 rounded-xl hover:bg-muted transition-all group cursor-pointer active:scale-[0.98]"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-background transition-colors shrink-0">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] sm:text-[13px] font-semibold text-foreground truncate">{project.name}</p>
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">
                        {project.deadline ? new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No deadline'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] sm:text-xs font-bold text-foreground">{project.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
      }

      {/* Staff Dashboard */}
      {
        isStaff && (
          <div className="space-y-6 sm:space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <StatCard
                title="Assigned Projects"
                value={assignedProjects.length}
                icon={Building2}
                variant="primary"
                onClick={() => openDetail('Your Assigned Projects', 'projects')}
              />
              <StatCard
                title="Tasks In Progress"
                value={assignedProjects.filter(p => p.status === 'active').length}
                icon={TrendingUp}
                variant="accent"
                onClick={() => openDetail('Active Execution Pipeline', 'projects')}
              />
              <StatCard
                title="Completed"
                value={assignedProjects.filter(p => p.status === 'completed').length}
                icon={CheckCircle2}
                onClick={() => openDetail('Successfully Delivered Assets', 'projects')}
              />
            </div>

            {/* Assigned Projects */}
            <div className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-sm">
              <SectionHeader
                title="Your Assigned Projects"
                className="mb-6"
              />
              {assignedProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                  {assignedProjects.map((project) => {
                    const currentPhase = project.phases.find(p => p.status === 'in-progress');
                    return (
                      <div
                        key={project.id}
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="p-4 sm:p-5 rounded-xl border border-border hover:border-secondary/30 hover:shadow-lg transition-all bg-background/50 cursor-pointer active:scale-[0.98]"
                      >
                        <div className="flex items-start justify-between mb-4 gap-2">
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-foreground truncate">{project.name}</h4>
                            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">
                              Deadline: {new Date(project.deadline).toLocaleDateString()}
                            </p>
                          </div>
                          <StatusBadge variant={project.status === 'active' ? 'info' : 'default'} className="shrink-0">
                            {project.status}
                          </StatusBadge>
                        </div>

                        {currentPhase && (
                          <div className="flex items-center gap-2 mb-4 p-2 bg-info/5 rounded-md">
                            <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-info shrink-0" />
                            <span className="text-[10px] sm:text-[11px] font-medium text-info truncate">
                              Phase: {projectPhaseLabels[currentPhase.phase]}
                            </span>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
                            <span className="text-muted-foreground font-medium">Progress</span>
                            <span className="font-bold text-foreground">{project.progress}%</span>
                          </div>
                          <div className="h-1 sm:h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-secondary rounded-full transition-all duration-700"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 sm:py-16 text-muted-foreground bg-muted/10 rounded-xl border-2 border-dashed border-border px-4">
                  <Building2 className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">No projects assigned yet</p>
                  <p className="text-xs mt-1">Check back later or contact your supervisor.</p>
                </div>
              )}
            </div>
          </div>
        )
      }
      <DashboardDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal(prev => ({ ...prev, isOpen: false }))}
        title={detailModal.title}
        type={detailModal.type}
        statusFilter={detailModal.statusFilter}
        data={
          detailModal.type === 'staff' ? staff :
            detailModal.type === 'clients' ? clients :
              detailModal.type === 'projects' ? projects :
                detailModal.type === 'payroll' ? payroll :
                  []
        }
        pagination={
          detailModal.type === 'staff' ? staffPagination :
            detailModal.type === 'clients' ? clientPagination :
              detailModal.type === 'projects' ? projectPagination :
                detailModal.type === 'payroll' ? payrollPagination :
                  undefined
        }
      />
    </PageContainer >
  );
};

export default Dashboard;
