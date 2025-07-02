import React from 'react';
import { Clock, Phone } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';
import { formatDate, formatCurrency } from '../../utils/dateUtils';

export const RecentAppointments: React.FC = () => {
  const { appointments } = useAppointments();
  
  const recentAppointments = appointments
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendente';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Agendamentos Recentes</h3>
      
      {recentAppointments.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nenhum agendamento ainda</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-gray-900">{appointment.clientName}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{appointment.service.name}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>{formatDate(appointment.date)} às {appointment.time}</span>
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3 h-3" />
                    <span>{appointment.clientPhone}</span>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatCurrency(appointment.service.price)}</p>
                <p className="text-xs text-gray-500 capitalize">{appointment.paymentMethod}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};