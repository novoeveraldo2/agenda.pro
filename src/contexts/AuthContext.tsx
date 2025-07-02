import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Tenant, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  businessName: string;
  phone: string;
  plan: 'essential' | 'complete';
  logo?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demonstration - In production, this would come from a real database
const initializeMockData = () => {
  // Initialize users if not exists
  const storedUsers = localStorage.getItem('system_users');
  if (!storedUsers) {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'novoeveraldo5@gmail.com',
        name: 'Administrador CIC ALERTA',
        role: 'admin',
        createdAt: new Date().toISOString(),
        isActive: true
      },
      {
        id: '2',
        email: 'comerciante@exemplo.com',
        name: 'João Silva',
        role: 'merchant',
        tenantId: 'tenant-1',
        createdAt: new Date().toISOString(),
        isActive: true
      }
    ];
    localStorage.setItem('system_users', JSON.stringify(mockUsers));
  } else {
    // Update existing admin email if it's different
    const users: User[] = JSON.parse(storedUsers);
    const adminUser = users.find(u => u.role === 'admin');
    if (adminUser && adminUser.email !== 'novoeveraldo5@gmail.com') {
      adminUser.email = 'novoeveraldo5@gmail.com';
      adminUser.name = 'Administrador CIC ALERTA';
      localStorage.setItem('system_users', JSON.stringify(users));
    }
  }

  // Initialize tenants if not exists
  const storedTenants = localStorage.getItem('system_tenants');
  if (!storedTenants) {
    const mockTenants: Tenant[] = [
      {
        id: 'tenant-1',
        name: 'Barbearia do João',
        businessName: 'João Silva Barbearia LTDA',
        email: 'comerciante@exemplo.com',
        phone: '(11) 99999-9999',
        plan: 'complete',
        isActive: true,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        maxUsers: 5,
        features: ['appointments', 'finances', 'whatsapp', 'reports', 'advanced-services']
      }
    ];
    localStorage.setItem('system_tenants', JSON.stringify(mockTenants));
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    tenant: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Initialize mock data
    initializeMockData();

    // Check for stored auth data
    const storedUser = localStorage.getItem('current_user');
    const storedTenant = localStorage.getItem('current_tenant');
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const tenant = storedTenant ? JSON.parse(storedTenant) : null;
        
        setAuthState({
          user,
          tenant,
          isAuthenticated: true,
          isLoading: false
        });
        console.log('User authenticated from storage:', user);
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        localStorage.removeItem('current_user');
        localStorage.removeItem('current_tenant');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get users from localStorage
      const storedUsers = localStorage.getItem('system_users');
      const storedTenants = localStorage.getItem('system_tenants');
      
      if (!storedUsers) {
        console.error('No users found in system');
        return false;
      }

      const users: User[] = JSON.parse(storedUsers);
      const tenants: Tenant[] = storedTenants ? JSON.parse(storedTenants) : [];
      
      // Find user by email
      const user = users.find(u => u.email === email && u.isActive);
      
      if (user && password === '123456') {
        let tenant = null;
        
        if (user.role === 'merchant' && user.tenantId) {
          tenant = tenants.find(t => t.id === user.tenantId && t.isActive) || null;
          
          // Check if tenant subscription is expired
          if (tenant && new Date(tenant.expiresAt) < new Date()) {
            alert('Sua assinatura expirou. Entre em contato com o administrador para renovar.');
            return false;
          }
        }
        
        setAuthState({
          user,
          tenant,
          isAuthenticated: true,
          isLoading: false
        });
        
        // Store current session
        localStorage.setItem('current_user', JSON.stringify(user));
        if (tenant) {
          localStorage.setItem('current_tenant', JSON.stringify(tenant));
        }
        
        console.log('User logged in successfully:', user);
        return true;
      }
      
      console.log('Invalid credentials for:', email);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      tenant: null,
      isAuthenticated: false,
      isLoading: false
    });
    
    localStorage.removeItem('current_user');
    localStorage.removeItem('current_tenant');
    console.log('User logged out');
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      // Get existing data
      const storedUsers = localStorage.getItem('system_users');
      const storedTenants = localStorage.getItem('system_tenants');
      
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
      const tenants: Tenant[] = storedTenants ? JSON.parse(storedTenants) : [];

      // Check if email already exists
      if (users.find(u => u.email === userData.email)) {
        console.error('Email already exists:', userData.email);
        return false;
      }

      // Create new tenant
      const newTenant: Tenant = {
        id: `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: userData.businessName,
        businessName: userData.businessName,
        email: userData.email,
        phone: userData.phone,
        plan: userData.plan,
        isActive: false, // Will be activated after payment confirmation
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days trial
        maxUsers: userData.plan === 'complete' ? 5 : 3,
        features: userData.plan === 'complete' 
          ? ['appointments', 'finances', 'whatsapp', 'reports', 'advanced-services']
          : ['appointments', 'whatsapp', 'basic-services']
      };

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: userData.email,
        name: userData.name,
        role: 'merchant',
        tenantId: newTenant.id,
        createdAt: new Date().toISOString(),
        isActive: false // Will be activated after payment confirmation
      };

      // Save to localStorage
      const updatedUsers = [...users, newUser];
      const updatedTenants = [...tenants, newTenant];
      
      localStorage.setItem('system_users', JSON.stringify(updatedUsers));
      localStorage.setItem('system_tenants', JSON.stringify(updatedTenants));

      // Initialize profile with registration data
      const initialProfile = {
        businessName: userData.businessName,
        phone: userData.phone,
        email: userData.email,
        logo: userData.logo || '',
        description: '',
        address: '',
        workingHours: {
          start: '08:00',
          end: '18:00',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        },
        paymentMethods: {
          pix: true,
          card: true,
          cash: true,
          pixKey: ''
        }
      };
      localStorage.setItem(`profile_${newTenant.id}`, JSON.stringify(initialProfile));

      console.log('New user registered:', newUser);
      console.log('New tenant created:', newTenant);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const storedUsers = localStorage.getItem('system_users');
      if (!storedUsers) return false;

      const users: User[] = JSON.parse(storedUsers);
      const user = users.find(u => u.email === email && u.isActive);

      if (user) {
        // In a real application, this would send an email with a reset code
        // For demo purposes, we'll just return true
        console.log('Password reset requested for:', email);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      register,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};