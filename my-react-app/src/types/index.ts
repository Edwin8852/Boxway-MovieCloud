export type UserRole = 'admin' | 'architect' | 'hr' | 'accountant' | 'intern';

export type ProjectPhase =
  | 'concept-design'
  | '3d-visualization'
  | 'approval-drawings'
  | 'working-drawings'
  | 'site-execution'
  | 'completion';

export type PhaseStatus = 'pending' | 'in-progress' | 'completed';

export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed';

export type PaymentStatus = 'pending' | 'partial' | 'completed';

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  joiningDate: string;
  salary: number;
  avatar?: string;
  assignedProjects: string[];
  password?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  dob?: string;
  qualification?: string;
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
  emergencyContact?: string;
  address?: string;
  bloodGroup?: string;
  pincode?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  siteLocation: string;
  contractValue: number;
  contractDate: string;
  projects: string[];
  paymentStatus: PaymentStatus;
  totalPaid: number;
}

export interface ProjectPhaseData {
  phase: ProjectPhase;
  status: PhaseStatus;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  assignedStaff: string[];
  status: ProjectStatus;
  phases: ProjectPhaseData[];
  startDate: string;
  deadline: string;
  budget: number;
  progress: number;
}

export interface PayrollRecord {
  id: string;
  staffId: string;
  month: string;
  year: number;
  baseSalary: number;
  attendance: number;
  totalDays: number;
  deductions: number;
  bonus: number;
  netSalary: number;
  status: 'pending' | 'approved' | 'paid';
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'half-day' | 'leave';
}
