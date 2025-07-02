import React, { useState, useEffect } from 'react';
import { User, Mail, Building, Calendar, MoreVertical, Eye, Edit, Trash2, Save, X } from 'lucide-react';
import { User as UserType, Tenant } from '../../types';

export const UsersList: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'admin' | 'merchant'>('all');
  const [users, setUsers] = useState<UserType[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserType>>({});

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

  const saveUsers = (updatedUsers: UserType[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('system_users', JSON.stringify(updatedUsers));
  };

  const filteredUsers = users.filter(user => {
    switch (filter) {
      case 'admin': return user.role === 'admin';
      case 'merchant': return user.role === 'merchant';
      default: return true;
    }
  });

  const handleEdit = (user: UserType) => {
    setEditingUser(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
  };

  const handleSave = () => {
    if (!editingUser) return;

    const updatedUsers = users.map(user => {
      if (user.id === editingUser) {
        return { ...user, ...editForm };
      }
      return user;
    });

    saveUsers(updatedUsers);
    setEditingUser(null);
    setEditForm({});
  };

  const handleCancel = () => {
    setEditingUser(null);
    setEditForm({});
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      saveUsers(updatedUsers);
    }
  };

  const getTenantName = (tenantId?: string) => {
    if (!tenantId) return null;
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant?.name || null;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'merchant': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'merchant': return 'Comerciante';
      default: return role;
    }
  };

  const getRandomLastLogin = () => {
    const days = Math.floor(Math.random() * 7);
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Usuários</h2>
          <p className="text-gray-600">Gerencie todos os usuários da plataforma</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Novo Usuário
        </button>
      </div>

      {/* Filtros */}
      <div className="flex space-x-2">
        {[
          { key: 'all', label: 'Todos' },
          { key: 'admin', label: 'Administradores' },
          { key: 'merchant', label: 'Comerciantes' }
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

      {/* Lista de Usuários */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Usuário</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Função</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Comerciante</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-700">Último Acesso</th>
                <th className="text-right py-3 px-6 font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const tenantName = getTenantName(user.tenantId);
                const lastLogin = getRandomLastLogin();
                const isEditing = editingUser === user.id;
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          {isEditing ? (
                            <div className="space-y-1">
                              <input
                                type="text"
                                value={editForm.name || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder="Nome"
                              />
                              <input
                                type="email"
                                value={editForm.email || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder="Email"
                              />
                            </div>
                          ) : (
                            <>
                              <h3 className="font-medium text-gray-900">{user.name}</h3>
                              <p className="text-sm text-gray-600 flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {user.email}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {isEditing ? (
                        <select
                          value={editForm.role || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value as 'admin' | 'merchant' }))}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="admin">Administrador</option>
                          <option value="merchant">Comerciante</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {tenantName ? (
                        <div className="flex items-center text-sm text-gray-600">
                          <Building className="w-4 h-4 mr-1" />
                          {tenantName}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
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
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(lastLogin).toLocaleDateString('pt-BR')}
                      </div>
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
                            onClick={() => handleEdit(user)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
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