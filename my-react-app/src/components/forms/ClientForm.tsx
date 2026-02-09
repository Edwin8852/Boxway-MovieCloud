import React, { useState } from 'react';
import type { Client, PaymentStatus } from '@/types';

interface ClientFormProps {
  initialData?: Partial<Client>;
  onSubmit: (data: Omit<Client, 'id'>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

import { FormGrid, FormField } from '@/components/ui/FormGrid';

const ClientForm: React.FC<ClientFormProps> = ({ initialData, onSubmit, onCancel, isSaving }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    company: initialData?.company || '',
    siteLocation: initialData?.siteLocation || '',
    contractValue: initialData?.contractValue || 0,
    contractDate: initialData?.contractDate || new Date().toISOString().split('T')[0],
    projects: initialData?.projects || [],
    paymentStatus: initialData?.paymentStatus || 'pending' as PaymentStatus,
    totalPaid: initialData?.totalPaid || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <FormGrid columns={2}>
          <FormField label="Client Name" required>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g. KJS Infrastructure Pvt Ltd"
            />
          </FormField>

          <FormField label="Company Name">
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="input-field"
              placeholder="e.g. KJS Group"
            />
          </FormField>

          <FormField label="Email Address" required>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              placeholder="e.g. contact@kjsinfra.in"
            />
          </FormField>

          <FormField label="Phone Number" required>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
              placeholder="e.g. +91 98765 43210"
            />
          </FormField>

          <FormField label="Site Location" required className="md:col-span-2">
            <input
              type="text"
              required
              value={formData.siteLocation}
              onChange={(e) => setFormData({ ...formData, siteLocation: e.target.value })}
              className="input-field"
              placeholder="e.g. 123 Main Street, Indiranagar, Bengaluru"
            />
          </FormField>

          <FormField label="Contract Value (₹)" required helpText="Total value of the signed contract.">
            <input
              type="number"
              required
              min={0}
              value={formData.contractValue}
              onChange={(e) => setFormData({ ...formData, contractValue: Number(e.target.value) })}
              className="input-field tabular-nums"
              placeholder="0"
            />
          </FormField>

          <FormField label="Contract Date" required>
            <input
              type="date"
              required
              value={formData.contractDate}
              onChange={(e) => setFormData({ ...formData, contractDate: e.target.value })}
              className="input-field"
            />
          </FormField>

          <FormField label="Payment Status" required>
            <select
              value={formData.paymentStatus}
              onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as PaymentStatus })}
              className="input-field"
            >
              <option value="pending">Payment Pending</option>
              <option value="partial">Partial Payment</option>
              <option value="completed">Fully Paid</option>
            </select>
          </FormField>

          <FormField label="Total Paid to Date (₹)" required helpText="Amount received from the client so far.">
            <input
              type="number"
              required
              min={0}
              value={formData.totalPaid}
              onChange={(e) => setFormData({ ...formData, totalPaid: Number(e.target.value) })}
              className="input-field tabular-nums"
              placeholder="0"
            />
          </FormField>
        </FormGrid>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
        <button type="submit" disabled={isSaving} className="btn-primary h-10 px-6 disabled:opacity-70">
          {isSaving ? 'Registering...' : (initialData ? 'Update Client Details' : 'Register Client')}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
