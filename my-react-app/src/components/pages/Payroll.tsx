import React, { useState } from 'react';
import { Download, CheckCircle, Clock, IndianRupee, FileText } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import StatCard from '@/components/ui/StatCard';
import type { PayrollRecord } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { PageContainer } from '@/components/ui/Layout';
import InvoiceModal from '@/components/ui/InvoiceModal';
import type { Staff as StaffType } from '@/types';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Payroll: React.FC = () => {
  const { payroll, payrollPagination, staff, refreshPayroll, updatePayrollStatus } = useApp();
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [selectedStaffMember, setSelectedStaffMember] = useState<StaffType | null>(null);

  const isAdmin = user?.role === 'admin' || user?.role === 'accountant';

  // Month/Year filter effect
  React.useEffect(() => {
    refreshPayroll(1, payrollPagination.limit, selectedMonth, selectedYear.toString());
  }, [selectedMonth, selectedYear]);

  const filteredPayroll = payroll; // Now handled server-side

  const getStaffName = (staffId: string) => {
    const member = staff.find(s => s.id === staffId);
    if (member) return member.name;
    // Fallback: check if the record itself has populated staff name (happens if staff array isn't full)
    const record = payroll.find(p => p.staffId === staffId);
    return record && (record as any).staffName ? (record as any).staffName : 'Unknown';
  };

  const getStaffRole = (staffId: string) => {
    const member = staff.find(s => s.id === staffId);
    if (member) return member.role.toUpperCase();
    const record = payroll.find(p => p.staffId === staffId);
    return record && (record as any).staffRole ? (record as any).staffRole.toUpperCase() : 'UNKNOWN';
  };

  const handleApprove = async (recordId: string) => {
    await updatePayrollStatus(recordId, 'approved');
  };

  const handleMarkPaid = async (recordId: string) => {
    await updatePayrollStatus(recordId, 'paid');
  };

  const handleViewInvoice = (record: PayrollRecord) => {
    const staffMember = staff.find(s => s.id === record.staffId);
    if (staffMember) {
      setSelectedRecord(record);
      setSelectedStaffMember(staffMember);
      setIsInvoiceModalOpen(true);
    }
  };

  const totalPending = filteredPayroll.filter(p => p.status === 'pending').length;
  const totalApproved = filteredPayroll.filter(p => p.status === 'approved').length;
  const totalPaid = filteredPayroll.filter(p => p.status === 'paid').length;
  const totalPayrollAmount = filteredPayroll.reduce((sum, p) => sum + p.netSalary, 0);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'approved': return 'info';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const columns = [
    {
      key: 'staff',
      header: 'Staff Member',
      render: (item: PayrollRecord) => (
        <div>
          <p className="text-sm font-semibold text-foreground leading-none">{getStaffName(item.staffId)}</p>
          <p className="text-[11px] text-muted-foreground mt-1.5 uppercase tracking-wider font-medium">{getStaffRole(item.staffId)}</p>
        </div>
      ),
    },
    {
      key: 'attendance',
      header: 'Attendance',
      align: 'center' as const,
      render: (item: PayrollRecord) => (
        <div className="flex flex-col items-center">
          <span className="text-[13px] font-bold text-foreground tabular-nums">
            {item.attendance} <span className="text-[11px] font-normal text-muted-foreground mr-1">/</span> {item.totalDays}
          </span>
          <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide font-medium">Days Present</p>
        </div>
      ),
    },
    {
      key: 'baseSalary',
      header: 'Gross Salary',
      align: 'right' as const,
      render: (item: PayrollRecord) => (
        <span className="text-[13px] font-medium text-foreground tabular-nums">{formatCurrency(item.baseSalary)}</span>
      ),
    },
    {
      key: 'adjustments',
      header: 'Adjustments',
      align: 'right' as const,
      render: (item: PayrollRecord) => (
        <div className="flex flex-col items-end gap-1">
          {item.bonus > 0 && (
            <span className="text-[11px] font-bold text-success tabular-nums">+{formatCurrency(item.bonus)}</span>
          )}
          {item.deductions > 0 && (
            <span className="text-[11px] font-bold text-destructive tabular-nums">-{formatCurrency(item.deductions)}</span>
          )}
          {item.bonus === 0 && item.deductions === 0 && (
            <span className="text-[11px] text-muted-foreground">None</span>
          )}
        </div>
      ),
    },
    {
      key: 'netSalary',
      header: 'Net Payable',
      align: 'right' as const,
      render: (item: PayrollRecord) => (
        <div className="flex flex-col items-end">
          <span className="text-[14px] font-bold text-foreground tabular-nums">{formatCurrency(item.netSalary)}</span>
          <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-medium">Monthly Payout</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Phase',
      align: 'center' as const,
      render: (item: PayrollRecord) => (
        <StatusBadge variant={getStatusBadgeVariant(item.status)}>
          {item.status}
        </StatusBadge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (item: PayrollRecord) => (
        <div className="flex items-center justify-end gap-1">
          {isAdmin && item.status === 'pending' && (
            <button
              onClick={() => handleApprove(item.id)}
              className="p-1.5 rounded-md hover:bg-success/10 transition-colors text-success"
              title="Approve"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          {isAdmin && item.status === 'approved' && (
            <button
              onClick={() => handleMarkPaid(item.id)}
              className="p-1.5 rounded-md hover:bg-info/10 transition-colors text-info"
              title="Mark as Paid"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 transition-all text-primary border border-primary/20 group/invoice"
            title="View Invoice"
            onClick={() => handleViewInvoice(item)}
          >
            <FileText className="w-3.5 h-3.5 transition-transform group-hover/invoice:scale-110" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Invoice</span>
          </button>
          <button
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Export Payslip"
            onClick={() => handleViewInvoice(item)}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer variant="dashboard">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-black text-foreground tracking-tighter leading-tight">Staff Payroll</h2>
          <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-2">
            Overseeing staff compensation, attendance-based deductions, and performance bonuses.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="input-field w-36 h-11 shadow-sm border-border/60"
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="input-field w-24 h-11 shadow-sm border-border/60"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>
      </div>

      {/* Extreme Stats Grid */}
      <div className="bg-card border border-border/60 rounded-[1.5rem] sm:rounded-[2rem] shadow-xl overflow-hidden mb-8 sm:mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x lg:divide-y-0 divide-border/40">
          <StatCard
            title="Total Monthly Payroll"
            value={formatCurrency(totalPayrollAmount)}
            icon={IndianRupee}
            isSeamless
          />
          <StatCard
            title="Pending Approval"
            value={totalPending}
            icon={Clock}
            variant="primary"
            isSeamless
          />
          <StatCard
            title="Approved Records"
            value={totalApproved}
            icon={CheckCircle}
            variant="accent"
            isSeamless
          />
          <StatCard
            title="Disbursed Funds"
            value={totalPaid}
            icon={CheckCircle}
            isSeamless
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredPayroll}
        emptyMessage="No payroll records generated for the selected period."
        currentPage={payrollPagination.currentPage}
        totalPages={payrollPagination.pages}
        totalRecords={payrollPagination.total}
        onPageChange={(page) => refreshPayroll(page, payrollPagination.limit, selectedMonth, selectedYear.toString())}
      />

      {isAdmin && totalPending > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={async () => {
              const pending = filteredPayroll.filter(p => p.status === 'pending');
              await Promise.all(pending.map(p => updatePayrollStatus(p.id, 'approved')));
            }}
            className="btn-primary gap-2 h-10 px-6"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Approve All Pending ({totalPending})</span>
          </button>
        </div>
      )}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        record={selectedRecord}
        staff={selectedStaffMember}
      />
    </PageContainer>
  );
};

export default Payroll;
