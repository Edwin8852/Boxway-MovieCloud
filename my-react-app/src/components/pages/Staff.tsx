import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, Users, UserCheck, Briefcase, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { useApp } from '@/context/AppContext';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import StaffForm from '@/components/forms/StaffForm';
import StaffDetails from '@/components/ui/StaffDetails';
import { roleLabels } from '@/utils/mockData';
import type { Staff as StaffType } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { PageContainer } from '@/components/ui/Layout';
import SearchInput from '@/components/ui/SearchInput';
import StatCard from '@/components/ui/StatCard';

const Staff: React.FC = () => {
  const { staff, staffPagination, refreshStaff, projects } = useApp();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffType | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    return {
      total: staffPagination.total || staff.length,
      active: staff.filter(s => projects.some(p => p.assignedStaff?.includes(s.id))).length,
      totalAssigned: projects.reduce((sum, p) => sum + (p.assignedStaff?.length || 0), 0)
    };
  }, [staff, projects, staffPagination]);

  React.useEffect(() => {
    if (location.state?.openRegister) {
      setIsModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Debounced search/filter effect
  React.useEffect(() => {
    const timer = setTimeout(() => {
      refreshStaff(1, staffPagination.limit || 5, search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Role filter effect
  React.useEffect(() => {
    refreshStaff(1, staffPagination.limit || 10, search);
  }, [roleFilter]);

  const handleAddStaff = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const handleEditStaff = (staffMember: StaffType) => {
    setEditingStaff(staffMember);
    setIsModalOpen(true);
  };

  const handleViewStaff = (staffMember: StaffType) => {
    setSelectedStaff(staffMember);
    setIsViewModalOpen(true);
  };

  const handleDeleteStaff = async (id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      try {
        const response = await api.delete(`/users/${id}`);
        if (response.data.success) {
          refreshStaff(staffPagination.currentPage, staffPagination.limit, search);
        }
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert('Failed to delete staff member');
      }
    }
  };

  const handleSaveStaff = async (data: any) => {
    setIsSaving(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        role: data.role.charAt(0).toUpperCase() + data.role.slice(1),
        contactInfo: {
          phone: data.phone,
          address: data.address
        },
        salaryDetails: { basicSalary: data.salary },
        joiningDate: data.joiningDate,
        password: data.password || 'Boxway@123',
        gender: data.gender,
        dob: data.dob,
        qualification: data.qualification,
        bankDetails: {
          accountNumber: data.accountNumber,
          bankName: data.bankName,
          ifscCode: data.ifscCode,
        },
        emergencyContact: data.emergencyContact,
        bloodGroup: data.bloodGroup,
        pincode: data.pincode
      };

      if (editingStaff) {
        const response = await api.put(`/users/${editingStaff.id}`, payload);
        if (response.data.success) {
          refreshStaff(staffPagination.currentPage, staffPagination.limit, search);
        }
      } else {
        const response = await api.post('/users/register', payload);
        if (response.data.success) {
          refreshStaff(1, staffPagination.limit, '');
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving staff:', error);
      alert('Failed to save staff member. Ensure you are an Admin/HR and the email is unique.');
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Staff Member',
      render: (item: StaffType) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-primary">
              {item.name.split(' ').map((n: string) => n[0]).join('')}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{item?.name || 'Unknown'}</p>
            <p className="text-[10px] text-muted-foreground truncate">{item?.email || 'No email'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (item: StaffType) => (
        <StatusBadge variant="info" className="text-[10px] py-0 h-5">
          {roleLabels[item.role] || item.role}
        </StatusBadge>
      ),
    },
    {
      key: 'phone',
      header: 'Contact',
      className: 'text-muted-foreground tabular-nums text-xs',
    },
    {
      key: 'joiningDate',
      header: 'Joined',
      render: (item: StaffType) => (
        <span className="text-muted-foreground text-xs">
          {new Date(item.joiningDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
    {
      key: 'projects',
      header: 'Ventures',
      align: 'center' as const,
      render: (item: StaffType) => {
        const assignedCount = (projects || []).filter(p =>
          (p.assignedStaff || []).includes(item.id)
        ).length;
        return (
          <span className="text-foreground font-semibold tabular-nums text-xs">{assignedCount}</span>
        );
      },
    },
    {
      key: 'salary',
      header: 'Salary (Pa)',
      align: 'right' as const,
      render: (item: StaffType) => (
        <span className="text-foreground font-semibold tabular-nums text-xs">
          {formatCurrency(item.salary)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right' as const,
      render: (item: StaffType) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditStaff(item);
            }}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteStaff(item.id);
            }}
            className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer variant="dashboard">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-black text-foreground tracking-tighter leading-tight">Personnel Directory</h2>
          <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-2">
            Managing {staffPagination.total || 0} professional team members across all departments.
          </p>
        </div>
        <button onClick={handleAddStaff} className="btn-primary gap-2 h-10 px-5 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-[0.98]">
          <Plus className="w-3.5 h-3.5" />
          <span className="font-black text-[10px] uppercase tracking-[0.2em]">Add Staff</span>
        </button>
      </div>

      <div className="bg-card border border-border/60 rounded-2xl shadow-lg overflow-hidden mb-6 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
          <StatCard
            title="Workforce"
            value={stats.total}
            icon={Users}
            isSeamless
            className="py-4"
          />
          <StatCard
            title="Deployed"
            value={stats.active}
            icon={UserCheck}
            variant="primary"
            isSeamless
            className="py-4"
          />
          <StatCard
            title="Allocations"
            value={stats.totalAssigned}
            icon={Briefcase}
            variant="accent"
            isSeamless
            className="py-4"
          />
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-xl p-3 shadow-sm mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search team..."
            className="flex-1"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input-field w-full sm:w-40 md:w-48 h-10 text-xs"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrator</option>
            <option value="architect">Architect</option>
            <option value="hr">HR Manager</option>
            <option value="accountant">Accountant</option>
            <option value="intern">Intern</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={staff}
        emptyMessage="No staff members match your criteria"
        onRowClick={handleViewStaff}
        currentPage={staffPagination.currentPage}
        totalPages={staffPagination.pages}
        totalRecords={staffPagination.total}
        onPageChange={(page) => refreshStaff(page, staffPagination.limit, search, roleFilter)}
      />

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Professional Profile"
        size="lg"
      >
        {selectedStaff && <StaffDetails staff={selectedStaff} />}
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
        size="xl"
      >
        <StaffForm
          initialData={editingStaff || undefined}
          onSubmit={handleSaveStaff}
          onCancel={() => setIsModalOpen(false)}
          isSaving={isSaving}
        />
      </Modal>
    </PageContainer>
  );
};

export default Staff;
