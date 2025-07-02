import React from 'react';
import { PieChart } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';

export const AppointmentsPieChart: React.FC = () => {
  const { appointments } = useAppointments();

  const statusCounts = {
    pending: appointments.filter(apt => apt.status === 'pending').length,
    confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length
  };

  const total = Object.values(statusCounts).reduce((acc, count) => acc + count, 0);

  const statusData = [
    {
      label: 'Pendentes',
      count: statusCounts.pending,
      percentage: total > 0 ? (statusCounts.pending / total) * 100 : 0,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    },
    {
      label: 'Confirmados',
      count: statusCounts.confirmed,
      percentage: total > 0 ? (statusCounts.confirmed / total) * 100 : 0,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      label: 'Concluídos',
      count: statusCounts.completed,
      percentage: total > 0 ? (statusCounts.completed / total) * 100 : 0,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      label: 'Cancelados',
      count: statusCounts.cancelled,
      percentage: total > 0 ? (statusCounts.cancelled / total) * 100 : 0,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <PieChart className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">Distribuição de Agendamentos</h3>
      </div>

      {total === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum agendamento encontrado</p>
        </div>
      ) : (
        <>
          {/* Simple visual representation */}
          <div className="mb-6">
            <div className="flex h-4 rounded-full overflow-hidden">
              {statusData.map((status, index) => (
                status.percentage > 0 && (
                  <div
                    key={index}
                    className={status.color}
                    style={{ width: `${status.percentage}%` }}
                  />
                )
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {statusData.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${status.color}`} />
                  <span className="text-sm text-gray-700">{status.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{status.count}</span>
                  <span className={`text-xs ${status.textColor}`}>
                    {status.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total de agendamentos</span>
              <span className="text-sm font-medium text-gray-900">{total}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};