import React, { useState } from 'react';
import { Building2, Users, IndianRupee, Layers, Save, Palette, Sun, Moon, Monitor } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { PageContainer } from '@/components/ui/Layout';
import { FormGrid, FormField } from '@/components/ui/FormGrid';

interface CompanySettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
}

interface SalaryStructure {
  role: string;
  minSalary: number;
  maxSalary: number;
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');

  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: 'Boxway Architecture',
    email: 'info@boxway.in',
    phone: '+91 98765 43210',
    address: '42, Design Square, Indiranagar, Bengaluru, Karnataka 560038',
    logo: '',
  });

  const [salaryStructures, setSalaryStructures] = useState<SalaryStructure[]>([
    { role: 'admin', minSalary: 80000, maxSalary: 120000 },
    { role: 'architect', minSalary: 70000, maxSalary: 100000 },
    { role: 'hr', minSalary: 55000, maxSalary: 80000 },
    { role: 'accountant', minSalary: 60000, maxSalary: 85000 },
    { role: 'intern', minSalary: 30000, maxSalary: 45000 },
  ]);

  const allTabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette, roles: ['admin', 'architect', 'hr', 'accountant', 'intern'] },
    { id: 'company', label: 'Agency Profile', icon: Building2, roles: ['admin'] },
    { id: 'roles', label: 'User Roles', icon: Users, roles: ['admin'] },
    { id: 'salary', label: 'Salary Matrices', icon: IndianRupee, roles: ['admin', 'hr', 'accountant'] },
    { id: 'phases', label: 'Project Phases', icon: Layers, roles: ['admin', 'architect'] },
  ];

  const tabs = allTabs.filter(tab => tab.roles.includes(user?.role || ''));

  const handleSaveCompany = () => {
    alert('Company settings synchronized!');
  };

  const handleSaveSalary = () => {
    alert('Salary matrices updated!');
  };

  return (
    <PageContainer>
      <div className="mb-10">
        <h2 className="text-3xl font-display font-black text-foreground tracking-tighter leading-tight">Settings & Configuration</h2>
        <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-2">
          Manage your personal preferences and organizational standards.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Responsive Navigation Sidebar/Top Bar */}
        <div className="lg:w-72 w-full flex-shrink-0 bg-card border border-border rounded-xl p-1.5 sm:p-2 shadow-sm">
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-1 sm:gap-0 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 lg:w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-all duration-200 group whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
              >
                <div className={`p-1 sm:p-1.5 rounded-md transition-colors ${activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted group-hover:bg-border'}`}>
                  <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="font-semibold text-[11px] sm:text-[13px]">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="hidden lg:block ml-auto w-1 h-4 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 w-full bg-card border border-border rounded-xl shadow-sm overflow-hidden min-h-[400px]">
          <div className="p-4 sm:p-8">
            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h3 className="text-[15px] font-bold text-foreground">Visual Preference</h3>
                  <p className="text-[13px] text-muted-foreground mt-1">Customize how Boxway looks on your device.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'light', label: 'Light Mode', icon: Sun },
                    { id: 'dark', label: 'Dark Mode', icon: Moon },
                    { id: 'system', label: 'System Default', icon: Monitor },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setTheme(option.id as any)}
                      className={`flex flex-col items-center gap-4 p-6 rounded-xl border-2 transition-all ${theme === option.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-muted/20 hover:border-border/80 hover:bg-muted/40'
                        }`}
                    >
                      <div className={`p-3 rounded-full ${theme === option.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <option.icon className="w-6 h-6" />
                      </div>
                      <span className="font-bold text-[13px]">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Company Profile */}
            {activeTab === 'company' && user?.role === 'admin' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h3 className="text-[15px] font-bold text-foreground">Agency Profile</h3>
                  <p className="text-[13px] text-muted-foreground mt-1">Foundational details for your architectural office.</p>
                </div>

                <div className="space-y-6">
                  <FormGrid columns={2}>
                    <FormField label="Official Agency Name" required>
                      <input
                        type="text"
                        value={companySettings.name}
                        onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })}
                        className="input-field"
                      />
                    </FormField>

                    <FormField label="Primary Contact Email" required>
                      <input
                        type="email"
                        value={companySettings.email}
                        onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                        className="input-field"
                      />
                    </FormField>

                    <FormField label="Verification Phone" required>
                      <input
                        type="tel"
                        value={companySettings.phone}
                        onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                        className="input-field tabular-nums"
                      />
                    </FormField>

                    <FormField label="Headquarters Address" className="md:col-span-2">
                      <textarea
                        rows={2}
                        value={companySettings.address}
                        onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                        className="input-field resize-none py-3 h-auto"
                      />
                    </FormField>
                  </FormGrid>
                </div>

                <div className="flex justify-end pt-6 border-t border-border">
                  <button onClick={handleSaveCompany} className="btn-primary h-10 px-6 gap-2">
                    <Save className="w-4 h-4" />
                    <span>Save Settings</span>
                  </button>
                </div>
              </div>
            )}

            {/* Roles & Permissions */}
            {activeTab === 'roles' && user?.role === 'admin' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h3 className="text-[15px] font-bold text-foreground">Access Governance</h3>
                  <p className="text-[13px] text-muted-foreground mt-1">Managing capability levels across organizational personas.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {['Admin', 'Architect', 'HR Manager', 'Accountant', 'Intern'].map((role) => (
                    <div key={role} className="flex items-center justify-between p-4 rounded-xl border border-border/80 hover:bg-muted/30 transition-colors group">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[13px] font-bold text-foreground">{role}</h4>
                          <div className={`w-2 h-2 rounded-full ${role === 'Admin' ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {role === 'Admin' && <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">Superuser Authority</span>}
                          {role === 'Architect' && ['Portfolio Control', 'Client Management', 'Timeline Access'].map(p => (
                            <span key={p} className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">{p}</span>
                          ))}
                          {role === 'HR Manager' && ['Staff Directory', 'Conflict Resolution', 'Payroll Visibility'].map(p => (
                            <span key={p} className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">{p}</span>
                          ))}
                        </div>
                      </div>
                      <button className="p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted-foreground/10 text-muted-foreground">
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Salary Structure */}
            {activeTab === 'salary' && ['admin', 'hr', 'accountant'].includes(user?.role || '') && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h3 className="text-[15px] font-bold text-foreground">Salary Matrices</h3>
                  <p className="text-[13px] text-muted-foreground mt-1">Establishing standardized compensation boundaries per role.</p>
                </div>

                <div className="space-y-3">
                  {salaryStructures.map((structure, index) => (
                    <div key={structure.role} className="flex flex-col md:flex-row md:items-end gap-4 p-5 rounded-xl border border-border/80 bg-muted/5">
                      <div className="flex-1">
                        <p className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground mb-3">{structure.role}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField label="Min Monthly">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[12px]">₹</span>
                              <input
                                type="number"
                                value={structure.minSalary}
                                onChange={(e) => {
                                  const updated = [...salaryStructures];
                                  updated[index].minSalary = Number(e.target.value);
                                  setSalaryStructures(updated);
                                }}
                                className="input-field pl-7 h-10 tabular-nums"
                              />
                            </div>
                          </FormField>
                          <FormField label="Max Monthly">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[12px]">₹</span>
                              <input
                                type="number"
                                value={structure.maxSalary}
                                onChange={(e) => {
                                  const updated = [...salaryStructures];
                                  updated[index].maxSalary = Number(e.target.value);
                                  setSalaryStructures(updated);
                                }}
                                className="input-field pl-7 h-10 tabular-nums"
                              />
                            </div>
                          </FormField>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-6 border-t border-border mt-8">
                  <button onClick={handleSaveSalary} className="btn-primary h-10 px-8 gap-2">
                    <Save className="w-4 h-4" />
                    <span>Save Salaries</span>
                  </button>
                </div>
              </div>
            )}

            {/* Operational Phases */}
            {activeTab === 'phases' && ['admin', 'architect'].includes(user?.role || '') && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h3 className="text-[15px] font-bold text-foreground">Operational Phases</h3>
                  <p className="text-[13px] text-muted-foreground mt-1">Standardized delivery stages for architectural workflows.</p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { name: 'Concept Design', description: 'Initial visioning, sketches, and feasibility studies.' },
                    { name: '3D Visualization', description: 'Photo-realistic modeling and experiential walk-throughs.' },
                    { name: 'Approval Drawings', description: 'Technical compliance and regulatory sanity checks.' },
                    { name: 'Working Drawings', description: 'Granular execution details and material specifications.' },
                    { name: 'Site Execution', description: 'Physical manifestation and on-site oversight.' },
                    { name: 'Completion', description: 'Handover protocols and client satisfaction audit.' },
                  ].map((phase, index) => (
                    <div key={phase.name} className="flex items-center gap-5 p-4 rounded-xl border border-border/60 hover:border-primary/30 transition-colors bg-muted/5 group">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-[13px] font-bold text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="flex-1">
                        <p className="text-[14px] font-bold text-foreground leading-none">{phase.name}</p>
                        <p className="text-[12px] text-muted-foreground mt-1.5">{phase.description}</p>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Settings;
