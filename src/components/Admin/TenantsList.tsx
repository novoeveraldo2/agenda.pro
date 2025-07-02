import React, { useState, useEffect } from 'react';
import { Building, Users, Calendar, DollarSign, MoreVertical, Eye, Edit, Trash2, Save, X } from 'lucide-react';
import { Tenant } from '../../types';

export const TenantsList: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [editingTenant, setEditingTenant] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Tenant>>({});

  useEffect(() => {
    // Load tenants from localStorage
    const storedTenants = localStorage.getItem('system_tenants');
    if (storedTenants) {
      setTenants(JSON.parse(storedTenants));
    }
  }, []);

  const saveTenants = (updatedTenants: Tenant[]) => {
    setTenants(updatedTenants);
    localStorage.setItem('system_tenants', JSON.stringify(updatedTenants));
  };

  const filteredTenants = tenants.filter(tenant => {
    switch (filter) {
      case 'active': return tenant.isActive;
      case 'inactive': return !tenant.isActive;
      case 'expired': return new Date(tenant.expiresAt) < new Date();
      default: return true;
    }
  });

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant.id);
    setEditForm({
      name: tenant.name,
      businessName: tenant.businessName,
      email: tenant.email,
      phone: tenant.phone,
      plan: tenant.plan,
      isActive: tenant.isActive
    });
  };

  const handleSave = () => {
    if (!editingTenant) return;

    const updatedTenants = tenants.map(tenant => {
      if (tenant.id === editingTenant) {
        return { ...tenant, ...editForm };
      }
      return tenant;
    });

    // Also update users table if email changed
    if (editForm.email) {
      const storedUsers = localStorage.getItem('system_users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = users.map((user: any) => {
          if (user.tenantId === editingTenant) {
            return { ...user, email: editForm.email };
          }
          return user;
        });
        localStorage.setItem('system_users', JSON.stringify(updatedUsers));
      }
    }

    saveTenants(updatedTenants);
    setEditingTenant(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingTenant(null);
    setEditForm({});
  };

  const handleDelete = (tenantId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este comerciante? Esta ação não pode ser desfeita.')) {
      const updatedTenants = tenants.filter(t => t.id !== tenantId);
      saveTenants(updatedTenants);

      // Also remove associated users
      const storedUsers = localStorage.getItem('system_users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = users.filter((user: any) => user.tenantId !== tenantId);
        localStorage.setItem('system_users', JSON.stringify(updatedUsers));
      }
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'essential': return 'bg-blue-100 text-blue-800';
      case 'complete': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'essential': return 'Essencial';
      case 'complete': return 'Completo';
      default: return plan;
    }
  };

  const getRandomStats = () => ({
    users: Math.floor(Math.random() * 5) + 1,
    appointments: Math.floor(Math.random() * 200) + 50,
    revenue: Math.floor(Math.random() * 5000) + 1000
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Comerciantes</h2>
          <p className="text-gray-600">Gerencie todos os comerciantes da plataforma</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Novo Comerciante
        </button>
      </div>

      {/* Filtros */}
      <div className="flex space-x-2">
        {[
          { key: 'all', label: 'Todos' },
          { key: 'active', label: 'Ativos' },
          { key: 'inactive', label: 'Inativos' },
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

      {/* Lista de Comerciantes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Comerciante</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Plano</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Estatísticas</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Expira em</th>
                <th className="text-right py-3 px-6 font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTenants.map((tenant) => {
                const stats = getRandomStats();
                const isEditing = editingTenant === tenant.id;
                
                return (
                  <tr key={tenant.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editForm.name || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Nome do negócio"
                          />
                          <input
                            type="email"
                            value={editForm.email || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Email"
                          />
                          <input
                            type="tel"
                            value={editForm.phone || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Telefone"
                          />
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-medium text-gray-900">{tenant.name}</h3>
                          <p className="text-sm text-gray-600">{tenant.email}</p>
                          <p className="text-sm text-gray-500">{tenant.phone}</p>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {isEditing ? (
                        <select
                          value={editForm.plan || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, plan: e.target.value as 'essential' | 'complete' }))}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="essential">Essencial</option>
                          <option value="complete">Completo</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(tenant.plan)}`}>
                          {getPlanLabel(tenant.plan)}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {isEditing ? (
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={editForm.isActive || false}
                            onChange={(e) => setEditForm(prev => ({ ...prev, isActive: e.target.checked }))}
                            className="rounded"
                          />
                          <span className="text-sm">Ativo</span>
                        </label>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          tenant.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {tenant.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{stats.users}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{stats.appointments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>R$ {stats.revenue}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">
                        {new Date(tenant.expiresAt).toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={handleSave}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Salvar"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg"
                            title="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(tenant)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tenant.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};