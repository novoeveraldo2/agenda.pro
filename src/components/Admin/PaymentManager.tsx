import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Clock, XCircle, Eye, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/dateUtils';

interface Payment {
  id: string;
  tenantId: string;
  tenantName: string;
  plan: 'essential' | 'complete';
  amount: number;
  status: 'pending' | 'confirmed' | 'expired';
  pixKey: string;
  createdAt: string;
  confirmedAt?: string;
}

export const PaymentManager: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'expired'>('all');

  useEffect(() => {
    // Load payments from localStorage
    const storedPayments = localStorage.getItem('system_payments');
    if (storedPayments) {
      setPayments(JSON.parse(storedPayments));
    }
  }, []);

  const savePayments = (newPayments: Payment[]) => {
    setPayments(newPayments);
    localStorage.setItem('system_payments', JSON.stringify(newPayments));
  };

  const confirmPayment = (paymentId: string) => {
    const updatedPayments = payments.map(payment => {
      if (payment.id === paymentId) {
        // Update tenant status
        const storedTenants = localStorage.getItem('system_tenants');
        if (storedTenants) {
          const tenants = JSON.parse(storedTenants);
          const updatedTenants = tenants.map((tenant: any) => {
            if (tenant.id === payment.tenantId) {
              return {
                ...tenant,
                isActive: true,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              };
            }
            return tenant;
          });
          localStorage.setItem('system_tenants', JSON.stringify(updatedTenants));
        }

        // Update user status
        const storedUsers = localStorage.getItem('system_users');
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const updatedUsers = users.map((user: any) => {
            if (user.tenantId === payment.tenantId) {
              return {
                ...user,
                isActive: true
              };
            }
            return user;
          });
          localStorage.setItem('system_users', JSON.stringify(updatedUsers));
        }

        return {
          ...payment,
          status: 'confirmed' as const,
          confirmedAt: new Date().toISOString()
        };
      }
      return payment;
    });

    savePayments(updatedPayments);
    alert('Pagamento confirmado! O comerciante foi ativado.');
  };

  const filteredPayments = payments.filter(payment => 
    filter === 'all' || payment.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendente';
      case 'expired': return 'Expirado';
      default: return status;
    }
  };

  const getPlanText = (plan: string) => {
    switch (plan) {
      case 'essential': return 'Essencial';
      case 'complete': return 'Completo';
      default: return plan;
    }
  };

  const totalRevenue = payments
    .filter(p => p.status === 'confirmed')
    .reduce((acc, p) => acc + p.amount, 0);

  const pendingRevenue = payments
    .filter(p => p.status === 'pending')
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gestão de Pagamentos</h2>
          <p className="text-gray-600">Gerencie os pagamentos dos comerciantes</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Receita Total</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingRevenue)}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Pagamentos</p>
              <p className="text-2xl font-bold text-blue-600">{payments.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'Todos' },
          { key: 'pending', label: 'Pendentes' },
          { key: 'confirmed', label: 'Confirmados' },
          { key: 'expired', label: 'Expirados' }
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === filterOption.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      {/* Lista de Pagamentos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 lg:px-6 font-medium text-gray-700">Comerciante</th>
                <th className="text-left py-3 px-4 lg:px-6 font-medium text-gray-700">Plano</th>
                <th className="text-left py-3 px-4 lg:px-6 font-medium text-gray-700">Valor</th>
                <th className="text-left py-3 px-4 lg:px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 lg:px-6 font-medium text-gray-700">Data</th>
                <th className="text-right py-3 px-4 lg:px-6 font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 lg:px-6">
                    <div>
                      <h3 className="font-medium text-gray-900">{payment.tenantName}</h3>
                      <p className="text-sm text-gray-600">ID: {payment.tenantId}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 lg:px-6">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {getPlanText(payment.plan)}
                    </span>
                  </td>
                  <td className="py-4 px-4 lg:px-6">
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </span>
                  </td>
                  <td className="py-4 px-4 lg:px-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                      {getStatusText(payment.status)}
                    </span>
                  </td>
                  <td className="py-4 px-4 lg:px-6">
                    <span className="text-sm text-gray-600">
                      {new Date(payment.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    {payment.confirmedAt && (
                      <p className="text-xs text-green-600">
                        Confirmado: {new Date(payment.confirmedAt).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-4 lg:px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {payment.status === 'pending' && (
                        <button
                          onClick={() => confirmPayment(payment.id)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                          title="Confirmar Pagamento"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pagamento encontrado</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'Ainda não há pagamentos registrados.'
              : `Não há pagamentos com status "${getStatusText(filter)}".`
            }
          </p>
        </div>
      )}
    </div>
  );
};