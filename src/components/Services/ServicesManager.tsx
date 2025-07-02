import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useServices } from '../../hooks/useServices';
import { ServiceForm } from './ServiceForm';
import { formatCurrency } from '../../utils/dateUtils';

export const ServicesManager: React.FC = () => {
  const { services, updateService, deleteService } = useServices();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateService(id, { isActive: !isActive });
  };

  const handleEdit = (id: string) => {
    setEditingService(id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      deleteService(id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingService(null);
  };

  const activeServices = services.filter(s => s.isActive);
  const inactiveServices = services.filter(s => !s.isActive);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gerenciar Serviços</h1>
          <p className="text-gray-600">Configure os serviços oferecidos pelo seu negócio</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Serviço</span>
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total de Serviços</h3>
          <p className="text-3xl font-bold text-blue-600">{services.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Serviços Ativos</h3>
          <p className="text-3xl font-bold text-green-600">{activeServices.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Preço Médio</h3>
          <p className="text-3xl font-bold text-purple-600">
            {formatCurrency(activeServices.reduce((acc, s) => acc + s.price, 0) / (activeServices.length || 1))}
          </p>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingService ? 'Editar Serviço' : 'Novo Serviço'}
          </h2>
          <ServiceForm
            serviceId={editingService}
            onSuccess={handleFormClose}
            onCancel={handleFormClose}
          />
        </div>
      )}

      {/* Lista de Serviços Ativos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Serviços Ativos</h2>
        {activeServices.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum serviço ativo encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeServices.map((service) => (
              <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(service.id)}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(service.id, service.isActive)}
                      className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded"
                    >
                      <EyeOff className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-600">{formatCurrency(service.price)}</span>
                  <span className="text-sm text-gray-500">{service.duration} min</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lista de Serviços Inativos */}
      {inactiveServices.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Serviços Inativos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inactiveServices.map((service) => (
              <div key={service.id} className="border border-gray-200 rounded-lg p-4 opacity-60">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(service.id)}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(service.id, service.isActive)}
                      className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-500">{formatCurrency(service.price)}</span>
                  <span className="text-sm text-gray-400">{service.duration} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};