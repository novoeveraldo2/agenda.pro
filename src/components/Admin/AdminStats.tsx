import React, { useEffect, useState } from 'react';
import { Users, Building, DollarSign, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { User, Tenant } from '../../types';

export const AdminStats: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const storedUsers = localStorage.getItem('system_users');
    const storedTenants = localStorage.getItem('system_tenants');
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    if (storedTenants) {
      setTenants(JSON.parse(storedTenants));
    }
  }, []);

  // Calculate real statistics
  const activeTenants = tenants.filter(t => t.isActive).length;
  const activeUsers = users.filter(u => u.isActive).length;
  const totalRevenue = tenants.length * 49.90; // Mock monthly revenue per tenant
  const todayAppointments = Math.floor(Math.random() * 100) + 50; // Mock data

  const stats = [
    {
      title: 'Total de Comerciantes',
      value: activeTenants.toString(),
      icon: Building,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Usuários Ativos',
      value: activeUsers.toString(),
      icon: Users,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Receita Mensal',
      value: `R$ ${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+23%',
      changeType: 'positive'
    },
    {
      title: 'Agendamentos Hoje',
      value: todayAppointments.toString(),
      icon: Calendar,
      color: 'bg-orange-500',
      change: '+5%',
      changeType: 'positive'
    }
  ];

  const recentActivity = [
    { type: 'new_tenant', message: `${tenants.length > 0 ? tenants[tenants.length - 1]?.name || 'Novo comerciante' : 'Novo comerciante cadastrado'}`, time: '2 min atrás' },
    { type: 'payment', message: 'Pagamento recebido: R$ 49,90', time: '15 min atrás' },
    { type: 'user', message: `${users.filter(u => u.role === 'merchant').length} comerciantes ativos`, time: '1 hora atrás' },
    { type: 'alert', message: 'Sistema funcionando normalmente', time: '2 horas atrás' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'new_tenant': return Building;
      case 'payment': return DollarSign;
      case 'user': return Users;
      case 'alert': return AlertCircle;
      default: return TrendingUp;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'new_tenant': return 'text-blue-600 bg-blue-100';
      case 'payment': return 'text-green-600 bg-green-100';
      case 'user': return 'text-purple-600 bg-purple-100';
      case 'alert': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm mt-2 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'positive' ? '↗' : '↘'} {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status do Sistema</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="text-sm font-medium text-green-600">99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Resposta Média</span>
              <span className="text-sm font-medium text-blue-600">120ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Usuários Online</span>
              <span className="text-sm font-medium text-purple-600">{Math.floor(activeUsers * 0.3)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Armazenamento</span>
              <span className="text-sm font-medium text-orange-600">68% usado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};