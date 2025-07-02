export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  description: string;
  isActive: boolean;
  tenantId: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  service: Service;
  date: string;
  time: string;
  paymentMethod: 'pix' | 'card' | 'cash';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  tenantId: string;
  paymentConfirmed?: boolean;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: string;
  appointmentId?: string;
  tenantId: string;
  isAutomatic?: boolean;
}

export interface DashboardStats {
  todayAppointments: number;
  weekRevenue: number;
  monthRevenue: number;
  pendingAppointments: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'merchant';
  tenantId?: string;
  createdAt: string;
  isActive: boolean;
}

export interface TenantProfile {
  businessName: string;
  description?: string;
  address?: string;
  phone: string;
  email: string;
  logo?: string;
  primaryColor?: string;
  workingHours?: {
    start: string;
    end: string;
    days: string[];
  };
  paymentMethods: {
    pix: boolean;
    card: boolean;
    cash: boolean;
    pixKey?: string;
  };
}

export interface Tenant {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  plan: 'essential' | 'complete';
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
  maxUsers: number;
  features: string[];
  profile?: TenantProfile;
}

export interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}