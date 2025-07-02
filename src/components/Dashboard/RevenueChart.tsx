import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';
import { formatCurrency } from '../../utils/dateUtils';

export const RevenueChart: React.FC = () => {
  const { appointments } = useAppointments();

  // Calculate revenue for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const revenueData = last7Days.map(date => {
    const dayRevenue = appointments
      .filter(apt => {
        const aptDate = new Date(apt.date);
        return (apt.status === 'confirmed' || apt.status === 'completed') &&
               aptDate.toDateString() === date.toDateString();
      })
      .reduce((acc, apt) => acc + apt.service.price, 0);

    return {
      date: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      revenue: dayRevenue
    };
  });

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1);
  const totalWeekRevenue = revenueData.reduce((acc, d) => acc + d.revenue, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Receita dos Últimos 7 Dias</h3>
        <div className="flex items-center space-x-2 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">{formatCurrency(totalWeekRevenue)}</span>
        </div>
      </div>

      <div className="space-y-4">
        {revenueData.map((day, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-12 text-sm text-gray-600 font-medium">
              {day.date}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
              />
            </div>
            <div className="w-20 text-sm text-gray-900 font-medium text-right">
              {formatCurrency(day.revenue)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Média diária</span>
          <span className="text-sm font-medium text-gray-900">
            {formatCurrency(totalWeekRevenue / 7)}
          </span>
        </div>
      </div>
    </div>
  );
};