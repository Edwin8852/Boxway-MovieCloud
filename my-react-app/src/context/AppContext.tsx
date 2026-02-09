import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import type { Staff, Client, Project, PayrollRecord } from '@/types';

export interface PaginationData {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
}

interface AppContextType {
    staff: Staff[];
    staffPagination: PaginationData;
    refreshStaff: (page?: number, limit?: number, search?: string, role?: string, sortBy?: string, sortOrder?: 'asc' | 'desc') => Promise<void>;
    clients: Client[];
    clientPagination: PaginationData;
    refreshClients: (page?: number, limit?: number, search?: string) => Promise<void>;
    projects: Project[];
    projectPagination: PaginationData;
    refreshProjects: (page?: number, limit?: number, search?: string, status?: string) => Promise<void>;
    updateProject: (projectId: string, data: Partial<Project>) => Promise<void>;
    payroll: PayrollRecord[];
    payrollPagination: PaginationData;
    refreshPayroll: (page?: number, limit?: number, month?: string, year?: string, status?: string) => Promise<void>;
    updatePayrollStatus: (recordId: string, status: 'pending' | 'approved' | 'paid') => Promise<void>;
    setPayroll: (payroll: PayrollRecord[]) => void;
    updateClient: (clientId: string, data: Partial<Client>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialPagination: PaginationData = {
    total: 0,
    pages: 1,
    currentPage: 1,
    limit: 10
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [staff, setStaff] = useState<Staff[]>([]);
    const [staffPagination, setStaffPagination] = useState<PaginationData>(initialPagination);

    const [clients, setClients] = useState<Client[]>([]);
    const [clientPagination, setClientPagination] = useState<PaginationData>(initialPagination);

    const [projects, setProjects] = useState<Project[]>([]);
    const [projectPagination, setProjectPagination] = useState<PaginationData>(initialPagination);

    const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
    const [payrollPagination, setPayrollPagination] = useState<PaginationData>(initialPagination);

    const refreshStaff = async (page = 1, limit = 10, search = '', role = 'all', sortBy = '', sortOrder: 'asc' | 'desc' = 'asc') => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            // Capitalize role for backend if it's not 'all'
            const activeRole = role !== 'all' ? role.charAt(0).toUpperCase() + role.slice(1) : 'all';
            const roleParam = activeRole !== 'all' ? `&role=${activeRole}` : '';
            const sortParam = sortBy ? `&sortBy=${sortBy}&sortOrder=${sortOrder}` : '';

            const response = await api.get(`/users?page=${page}&limit=${limit}&search=${search}${roleParam}${sortParam}`);
            if (response.data.success && Array.isArray(response.data.data)) {
                const mappedStaff = response.data.data.map((user: any) => ({
                    id: user._id,
                    name: user.name || '',
                    email: user.email || '',
                    role: (user.role || 'intern').toLowerCase(),
                    phone: user.contactInfo?.phone || '',
                    joiningDate: user.joiningDate ? user.joiningDate.split('T')[0] : new Date().toISOString().split('T')[0],
                    salary: user.salaryDetails?.basicSalary || 0,
                    assignedProjects: [],
                }));
                setStaff(mappedStaff);
                if (response.data.pagination) {
                    setStaffPagination(response.data.pagination);
                }
            } else {
                setStaff([]);
            }
        } catch (error) {
            console.error('Error fetching staff:', error);
            setStaff([]);
        }
    };

    const refreshClients = async (page = 1, limit = 10, search = '') => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await api.get(`/clients?page=${page}&limit=${limit}&search=${search}`);
            if (response.data.success && Array.isArray(response.data.data)) {
                const mappedClients = response.data.data.map((client: any) => ({
                    id: client._id,
                    name: client.name || '',
                    email: client.email || '',
                    phone: client.phone || '',
                    company: client.company || '',
                    siteLocation: client.siteLocation || '',
                    contractValue: client.contractValue || 0,
                    contractDate: client.contractDate ? client.contractDate.split('T')[0] : '',
                    projects: client.assignedProjects || [],
                    paymentStatus: client.paymentStatus || 'pending',
                    totalPaid: client.totalPaid || 0,
                }));
                setClients(mappedClients);
                if (response.data.pagination) {
                    setClientPagination(response.data.pagination);
                }
            } else {
                setClients([]);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
            setClients([]);
        }
    };

    const updateClient = async (clientId: string, data: Partial<Client>) => {
        try {
            const response = await api.put(`/clients/${clientId}`, data);
            if (response.data.success) {
                await refreshClients(clientPagination.currentPage, clientPagination.limit);
            }
        } catch (error) {
            console.error('Error updating client:', error);
        }
    };

    const refreshProjects = async (page = 1, limit = 10, search = '', status = 'all') => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await api.get(`/projects?page=${page}&limit=${limit}&search=${search}&status=${status}`);
            if (response.data.success && Array.isArray(response.data.data)) {
                const mappedProjects = response.data.data.map((project: any) => ({
                    id: project._id,
                    name: project.name || '',
                    description: project.description || '',
                    clientId: project.client?._id || project.client || '',
                    assignedStaff: project.assignedStaff?.map((s: any) => s._id || s) || [],
                    status: project.status || 'planning',
                    phases: project.phases || [],
                    startDate: project.startDate ? project.startDate.split('T')[0] : '',
                    deadline: project.deadline ? project.deadline.split('T')[0] : '',
                    budget: project.budget || 0,
                    progress: project.progress || 0,
                }));
                setProjects(mappedProjects);
                if (response.data.pagination) {
                    setProjectPagination(response.data.pagination);
                }
            } else {
                setProjects([]);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
            setProjects([]);
        }
    };

    const updateProject = async (projectId: string, data: Partial<Project>) => {
        try {
            const response = await api.put(`/projects/${projectId}`, data);
            if (response.data.success) {
                await refreshProjects(projectPagination.currentPage, projectPagination.limit);
            }
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    const refreshPayroll = async (page = 1, limit = 10, month = '', year = '', status = '') => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const statusParam = status ? `&status=${status}` : '';
            const response = await api.get(`/payroll?page=${page}&limit=${limit}&month=${month}&year=${year}${statusParam}`);
            if (response.data.success && Array.isArray(response.data.data)) {
                const mappedPayroll = response.data.data.map((p: any) => {
                    // Backend stores month as "January 2025" or similar
                    const monthParts = p.month.split(' ');
                    const monthName = monthParts[0];
                    const yearVal = monthParts[1] ? parseInt(monthParts[1]) : 2025;

                    return {
                        id: p._id,
                        staffId: p.staff?._id || p.staff || '',
                        // Carry populated names for faster lookup or fallback
                        staffName: p.staff?.name,
                        staffRole: p.staff?.role,
                        month: monthName,
                        year: yearVal,
                        baseSalary: p.basicSalary || 0,
                        attendance: p.attendanceDays || 0,
                        totalDays: 30,
                        deductions: (p.basicSalary || 0) - (p.totalCalculatedSalary || 0) + (p.allowances || 0),
                        bonus: p.allowances || 0,
                        netSalary: p.totalCalculatedSalary || 0,
                        status: (p.status || 'pending').toLowerCase(),
                    };
                });
                setPayroll(mappedPayroll);
                if (response.data.pagination) {
                    setPayrollPagination(response.data.pagination);
                }
            }
        } catch (error) {
            console.error('Error fetching payroll:', error);
        }
    };

    const updatePayrollStatus = async (recordId: string, status: 'pending' | 'approved' | 'paid') => {
        try {
            const backendStatus = status.charAt(0).toUpperCase() + status.slice(1);
            const response = await api.put(`/payroll/${recordId}`, { status: backendStatus });
            if (response.data.success) {
                await refreshPayroll(payrollPagination.currentPage, payrollPagination.limit);
            }
        } catch (error) {
            console.error('Error updating payroll status:', error);
        }
    };

    useEffect(() => {
        if (user) {
            refreshStaff(1, 10, '', 'all');
            refreshClients(1, 10, '');
            refreshProjects(1, 10, '', 'all');
            refreshPayroll(1, 10, '', '');
        }
    }, [user]);

    return (
        <AppContext.Provider value={{
            staff, staffPagination, refreshStaff,
            clients, clientPagination, refreshClients,
            projects, projectPagination, refreshProjects, updateProject,
            payroll, payrollPagination, refreshPayroll, updatePayrollStatus, setPayroll,
            updateClient
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
