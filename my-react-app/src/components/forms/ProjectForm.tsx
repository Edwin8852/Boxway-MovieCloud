import React, { useState } from 'react';
import type { Project, ProjectStatus, Client, Staff, ProjectPhase, PhaseStatus } from '@/types';
import { FormGrid, FormField } from '@/components/ui/FormGrid';

interface ProjectFormProps {
  initialData?: Partial<Project>;
  clients: Client[];
  staff: Staff[];
  onSubmit: (data: Omit<Project, 'id'>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const defaultPhases: { phase: ProjectPhase; status: PhaseStatus }[] = [
  { phase: 'concept-design', status: 'pending' },
  { phase: '3d-visualization', status: 'pending' },
  { phase: 'approval-drawings', status: 'pending' },
  { phase: 'working-drawings', status: 'pending' },
  { phase: 'site-execution', status: 'pending' },
  { phase: 'completion', status: 'pending' },
];

const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  clients,
  staff,
  onSubmit,
  onCancel,
  isSaving
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    clientId: initialData?.clientId || (clients[0]?.id || ''),
    assignedStaff: initialData?.assignedStaff || [],
    status: initialData?.status || 'planning' as ProjectStatus,
    phases: initialData?.phases || defaultPhases,
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    deadline: initialData?.deadline || '',
    budget: initialData?.budget || 0,
    progress: initialData?.progress || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleStaffToggle = (staffId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedStaff: prev.assignedStaff.includes(staffId)
        ? prev.assignedStaff.filter(id => id !== staffId)
        : [...prev.assignedStaff, staffId],
    }));
  };

  const architects = staff.filter(s => s.role === 'architect' || s.role === 'intern');

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">Basic Information</h3>
          <FormGrid columns={2}>
            <FormField label="Project Name" required className="md:col-span-2">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="e.g. Metro Tower Complex"
              />
            </FormField>

            <FormField label="Description" required className="md:col-span-2">
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field resize-none py-3 h-auto"
                placeholder="Brief project summary and scope..."
              />
            </FormField>

            <FormField label="Client" required>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="input-field"
              >
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Initial Status" required>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                className="input-field"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </FormField>
          </FormGrid>
        </div>

        {/* Schedule & Budget */}
        <div className="space-y-4">
          <h3 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">Schedule & Budget</h3>
          <FormGrid columns={3}>
            <FormField label="Start Date" required>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="input-field"
              />
            </FormField>

            <FormField label="Deadline" required>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="input-field"
              />
            </FormField>

            <FormField label="Budget (₹)" required>
              <input
                type="number"
                required
                min={0}
                step="any"
                value={formData.budget || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ ...formData, budget: val === '' ? 0 : Number(val) });
                }}
                onWheel={(e) => (e.target as HTMLInputElement).blur()}
                className="input-field tabular-nums focus:bg-white transition-colors"
                placeholder="0"
              />
            </FormField>
          </FormGrid>
        </div>

        {/* Team Assignment */}
        <div className="space-y-4">
          <h3 className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border pb-2">Architectural Team</h3>
          <FormField label="Select Team Members" helpText="Assign architects and interns to this project.">
            <div className="flex flex-wrap gap-2 pt-1">
              {architects.map(member => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => handleStaffToggle(member.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${formData.assignedStaff.includes(member.id)
                    ? 'bg-primary/10 border-primary/30 text-primary shadow-sm'
                    : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                  {member.name}
                </button>
              ))}
            </div>
          </FormField>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
        <button type="submit" disabled={isSaving} className="btn-primary h-11 px-8 disabled:opacity-70">
          {isSaving ? 'Synchronizing...' : (initialData?.name ? 'Save Project Changes' : 'Create Project Roadmap')}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
