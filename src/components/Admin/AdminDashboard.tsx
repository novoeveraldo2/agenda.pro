import React, { useState } from 'react';
import { Users, Building, DollarSign, TrendingUp, Settings, UserPlus, CreditCard, Cog } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { TenantsList } from './TenantsList';
import { UsersList } from './UsersList';
import { AdminStats } from './AdminStats';
import { PaymentManager } from './PaymentManager';
import { AdminSettings } from './AdminSettings';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
    { id: 'tenants', label: 'Comerciantes', icon: Building },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
    { id: 'admin-settings', label: 'Configurações', icon: Cog },
    { id: 'settings', label: 'Sistema', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminStats />;
      case 'tenants':
        return <TenantsList />;
      case 'users':
        return <UsersList />;
      case 'payments':
        return <PaymentManager />;
      case 'admin-settings':
        return <AdminSettings />;
      case 'settings':
        return <div className="p-6">Configurações do sistema em desenvolvimento...</div>;
      default:
        return <AdminStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full lg:w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-sm text-gray-600">CIC ALERTA SaaS</p>
        </div>
        
        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors mb-2
                  ${activeTab === item.id 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:mt-8 lg:mx-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-600">{user?.email}</p>
            <button
              onClick={logout}
              className="mt-2 text-xs text-red-600 hover:text-red-700"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {new Date().toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};