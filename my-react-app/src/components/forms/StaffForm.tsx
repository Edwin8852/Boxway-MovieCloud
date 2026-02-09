import React, { useState } from 'react';
import type { Staff, UserRole } from '@/types';

interface StaffFormProps {
  initialData?: Partial<Staff>;
  onSubmit: (data: Omit<Staff, 'id'>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

import { FormGrid, FormField } from '@/components/ui/FormGrid';

const StaffForm: React.FC<StaffFormProps> = ({ initialData, onSubmit, onCancel, isSaving }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: initialData?.password || '',
    role: initialData?.role || 'architect' as UserRole,
    phone: initialData?.phone || '',
    joiningDate: initialData?.joiningDate || new Date().toISOString().split('T')[0],
    salary: initialData?.salary || 0,
    assignedProjects: initialData?.assignedProjects || [],
    gender: initialData?.gender || 'Male',
    dob: initialData?.dob ? new Date(initialData.dob).toISOString().split('T')[0] : '',
    qualification: initialData?.qualification || '',
    accountNumber: initialData?.bankDetails?.accountNumber || '',
    bankName: initialData?.bankDetails?.bankName || '',
    ifscCode: initialData?.bankDetails?.ifscCode || '',
    emergencyContact: initialData?.emergencyContact || '',
    address: initialData?.address || '',
    bloodGroup: initialData?.bloodGroup || '',
    pincode: initialData?.pincode || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <FormGrid columns={3}>
          <FormField label="Full Name" required>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g. Karthik Raja"
            />
          </FormField>

          <FormField label="Email Address" required>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              placeholder="e.g. karthik@boxway.in"
            />
          </FormField>

          <FormField label="Role / Department" required>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="input-field"
            >
              <option value="admin">Administrator</option>
              <option value="architect">Architect</option>
              <option value="hr">HR Manager</option>
              <option value="accountant">Accountant</option>
              <option value="intern">Intern</option>
            </select>
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

          <FormField label="Joining Date" required>
            <input
              type="date"
              required
              value={formData.joiningDate}
              onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
              className="input-field"
            />
          </FormField>

          <FormField label="Gender" required>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
              className="input-field"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </FormField>

          <FormField label="Date of Birth" required>
            <input
              type="date"
              required
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="input-field"
            />
          </FormField>

          <FormField label="Qualification" required>
            <input
              type="text"
              required
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              className="input-field"
              placeholder="e.g. B.Arch"
            />
          </FormField>

          <FormField label="Emergency Contact Number" required>
            <input
              type="tel"
              required
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              className="input-field"
              placeholder="e.g. +91 98765 43210"
            />
          </FormField>

          <FormField label="Blood Group">
            <select
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              className="input-field"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </FormField>

          <FormField label="Pincode" required>
            <input
              type="text"
              required
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              className="input-field"
              placeholder="e.g. 600001"
            />
          </FormField>

          <FormField label="Address" className="col-span-3">
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input-field min-h-[80px]"
              placeholder="Full mailing address"
            />
          </FormField>

          <div className="col-span-3 mt-4">
            <h4 className="text-sm font-bold text-foreground mb-4">Bank Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Bank Name">
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="input-field"
                  placeholder="e.g. HDFC Bank"
                />
              </FormField>
              <FormField label="Account Number">
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="input-field"
                  placeholder="000000000000"
                />
              </FormField>
              <FormField label="IFSC Code">
                <input
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                  className="input-field"
                  placeholder="HDFC0001234"
                />
              </FormField>
            </div>
          </div>
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
          {isSaving ? 'Saving...' : (initialData ? 'Update Staff Member' : 'Add Staff Member')}
        </button>
      </div>
    </form>
  );
};

export default StaffForm;
