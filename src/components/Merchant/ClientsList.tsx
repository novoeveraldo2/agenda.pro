import React, { useState, useEffect } from 'react';
import { Users, Phone, Calendar, Search, Filter } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';
import { formatDate } from '../../utils/dateUtils';

interface Client {
  name: string;
  phone: string;
  lastAppointment: string;
  totalAppointments: number;
  totalSpent: number;
  services: string[];
}

export const ClientsList: React.FC = () => {
  const { appointments } = useAppointments();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'lastAppointment' | 'totalSpent'>('name');

  useEffect(() => {
    // Process appointments to create client list
    const clientMap = new Map<string, Client>();

    appointments.forEach(appointment => {
      const key = `${appointment.clientName}-${appointment.clientPhone}`;
      
      if (clientMap.has(key)) {
        const client = clientMap.get(key)!;
        client.totalAppointments += 1;
        client.totalSpent += appointment.service.price;
        
        if (new Date(appointment.date) > new Date(client.lastAppointment)) {
          client.lastAppointment = appointment.date;
        }
        
        if (!client.services.includes(appointment.service.name)) {
          client.services.push(appointment.service.name);
        }
      } else {
        clientMap.set(key, {
          name: appointment.clientName,
          phone: appointment.clientPhone,
          lastAppointment: appointment.date,
          totalAppointments: 1,
          totalSpent: appointment.service.price,
          services: [appointment.service.name]
        });
      }
    });

    setClients(Array.from(clientMap.values()));
  }, [appointments]);

  const filteredClients = clients
    .filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'lastAppointment':
          return new Date(b.lastAppointment).getTime() - new Date(a.lastAppointment).getTime();
        case 'totalSpent':
          return b.totalSpent - a.totalSpent;
        default:
          return 0;
      }
    });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Clientes Cadastrados</h1>
        <p className="text-gray-600">Gerencie sua base de clientes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total de Clientes</p>
              <p className="text-2xl font-bold text-blue-600">{clients.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Agendamentos Totais</p>
              <p className="text-2xl font-bold text-green-600">
                {clients.reduce((acc, client) => acc + client.totalAppointments, 0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Ticket Médio</p>
              <p className="text-2xl font-bold text-purple-600">
                R$ {clients.length > 0 ? (clients.reduce((acc, client) => acc + client.totalSpent, 0) / clients.reduce((acc, client) => acc + client.totalAppointments, 0)).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Buscar por nome ou telefone..."
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Ordenar por:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Nome</option>
              <option value="lastAppointment">Último Agendamento</option>
              <option value="totalSpent">Valor Gasto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'Tente buscar com outros termos'
                : 'Os clientes aparecerão aqui conforme fizerem agendamentos'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Cliente</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Contato</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Agendamentos</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Total Gasto</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Último Agendamento</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Serviços</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClients.map((client, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{client.name}</h3>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{client.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-900">{client.totalAppointments}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-green-600">
                        R$ {client.totalSpent.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600">{formatDate(client.lastAppointment)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {client.services.slice(0, 2).map((service, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                        {client.services.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{client.services.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};