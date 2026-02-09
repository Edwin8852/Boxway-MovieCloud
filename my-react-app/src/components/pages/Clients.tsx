import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import api from '@/services/api';
import { useApp } from '@/context/AppContext';
import DataTable from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import ClientForm from '@/components/forms/ClientForm';
import type { Client } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { PageContainer } from '@/components/ui/Layout';
import SearchInput from '@/components/ui/SearchInput';
import StatCard from '@/components/ui/StatCard';
import { Users, Building2, CreditCard } from 'lucide-react';

const Clients: React.FC = () => {
  const { clients, clientPagination, refreshClients, projects } = useApp();
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const stats = useMemo(() => {
    return {
      total: clientPagination.total || clients.length,
      corporate: clients.filter(c => c.company).length,
      totalValue: clients.reduce((sum, c) => sum + (c.contractValue || 0), 0)
    };
  }, [clients, clientPagination]);

  // Debounced search effect
  React.useEffect(() => {
    const timer = setTimeout(() => {
      refreshClients(1, 10, search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredClients = useMemo(() => {
    if (!Array.isArray(clients)) return [];
    return clients.filter((c) => {
      const matchesPayment = paymentFilter === 'all' || c?.paymentStatus === paymentFilter;
      return matchesPayment;
    });
  }, [clients, paymentFilter]);

  const handleAddClient = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      try {
        await api.delete(`/clients/${id}`);
        refreshClients();
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Failed to delete client.');
      }
    }
  };

  const handleSaveClient = async (data: Omit<Client, 'id'>) => {
    setIsSaving(true);
    try {
      if (editingClient) {
        await api.put(`/clients/${editingClient.id}`, data);
      } else {
        await api.post('/clients', data);
      }
      refreshClients();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Failed to save client details.');
    } finally {
      setIsSaving(false);
    }
  };

  const getPaymentBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'partial': return 'warning';
      case 'pending': return 'error';
      default: return 'default';
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Client / Company',
      render: (item: Client) => (
        <div>
          <p className="text-sm font-semibold text-foreground leading-none">{item?.name || 'Unknown Client'}</p>
          {item?.company && (
            <p className="text-[11px] text-muted-foreground mt-1.5">{item.company}</p>
          )}
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact Details',
      render: (item: Client) => (
        <div className="space-y-1">
          <p className="text-[13px] text-foreground font-medium">{item.email}</p>
          <p className="text-[11px] text-muted-foreground tabular-nums">{item.phone}</p>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Site Location',
      render: (item: Client) => (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.siteLocation)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-primary transition-colors hover:underline"
        >
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground/60" />
          <span className="truncate max-w-[180px]">{item.siteLocation}</span>
        </a>
      ),
    },
    {
      key: 'contract',
      header: 'Contract Value',
      align: 'right' as const,
      render: (item: Client) => (
        <div className="flex flex-col items-end">
          <div className="text-[13px] font-bold text-foreground tabular-nums">
            {formatCurrency(item.contractValue)}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-medium">Total Project Value</p>
        </div>
      ),
    },
    {
      key: 'projects',
      header: 'Projects',
      align: 'center' as const,
      render: (item: Client) => {
        const clientProjects = projects.filter(p => p.clientId === item.id);
        return (
          <span className="text-[13px] font-bold text-foreground tabular-nums">{clientProjects.length}</span>
        );
      },
    },
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      align: 'right' as const,
      render: (item: Client) => (
        <div className="flex flex-col items-end gap-1.5">
          <StatusBadge variant={getPaymentBadgeVariant(item.paymentStatus)}>
            {item.paymentStatus}
          </StatusBadge>
          <p className="text-[11px] font-medium text-muted-foreground tabular-nums">
            {formatCurrency(item.totalPaid)} <span className="opacity-60">paid</span>
          </p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right' as const,
      render: (item: Client) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClient(item);
            }}
            className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Edit Client"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClient(item.id);
            }}
            className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
            title="Delete Client"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display font-black text-foreground tracking-tighter leading-tight">Client Directory</h2>
          <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-2">
            Managing {clients?.length || 0} active client accounts and their respective sites.
          </p>
        </div>
        <button onClick={handleAddClient} className="btn-primary gap-2 h-11 px-6 shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-[0.98]">
          <Plus className="w-4 h-4" />
          <span className="font-black text-[11px] uppercase tracking-[0.2em]">Add Client</span>
        </button>
      </div>

      {/* Extreme Stats Grid */}
      <div className="bg-card border border-border/60 rounded-[1.5rem] sm:rounded-[2rem] shadow-xl overflow-hidden mb-8 sm:mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
          <StatCard
            title="Total Portfolios"
            value={stats.total}
            icon={Users}
            isSeamless
          />
          <StatCard
            title="Corporate Entities"
            value={stats.corporate}
            icon={Building2}
            variant="primary"
            isSeamless
          />
          <StatCard
            title="Contractual Volume"
            value={formatCurrency(stats.totalValue)}
            icon={CreditCard}
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
            placeholder="Search clients..."
            className="flex-1"
          />
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="input-field w-full sm:w-48 md:w-52 h-10 text-xs sm:text-sm"
          >
            <option value="all">All Payments</option>
            <option value="completed">Fully Paid</option>
            <option value="partial">Partial Payment</option>
            <option value="pending">Payment Pending</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredClients}
        emptyMessage="No clients found matching your search"
        onRowClick={handleEditClient}
        currentPage={clientPagination.currentPage}
        totalPages={clientPagination.pages}
        totalRecords={clientPagination.total}
        onPageChange={(page) => refreshClients(page, clientPagination.limit, search)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? 'Edit Client Details' : 'Onboard New Client'}
        size="lg"
      >
        <ClientForm
          initialData={editingClient || undefined}
          onSubmit={handleSaveClient}
          onCancel={() => setIsModalOpen(false)}
          isSaving={isSaving}
        />
      </Modal>
    </PageContainer>
  );
};

export default Clients;
