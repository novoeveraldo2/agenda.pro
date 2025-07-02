import React from 'react';
import { Calendar, DollarSign, Clock, TrendingUp, CheckCircle, XCircle, Users, Target } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';
import { useServices } from '../../hooks/useServices';
import { useTransactions } from '../../hooks/useTransactions';
import { StatsCard } from './StatsCard';
import { RecentAppointments } from './RecentAppointments';
import { RevenueChart } from './RevenueChart';
import { AppointmentsPieChart } from './AppointmentsPieChart';
import { formatCurrency, isToday } from '../../utils/dateUtils';

export const Dashboard: React.FC = () => {
  const { appointments } = useAppointments();
  const { getActiveServices } = useServices();
  const { getWeeklyIncome, getMonthlyIncome } = useTransactions();

  // Calculate real-time statistics
  const todayAppointments = appointments.filter(apt => isToday(apt.date)).length;
  const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
  const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmed').length;
  const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
  const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled').length;
  
  // Calculate revenue from confirmed and completed appointments
  const weekRevenue = appointments
    .filter(apt => {
      const aptDate = new Date(apt.date);
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      return (apt.status === 'confirmed' || apt.status === 'completed') && 
             aptDate >= weekStart;
    })
    .reduce((acc, apt) => acc + apt.service.price, 0);

  const monthRevenue = appointments
    .filter(apt => {
      const aptDate = new Date(apt.date);
      const now = new Date();
      
      return (apt.status === 'confirmed' || apt.status === 'completed') && 
             aptDate.getMonth() === now.getMonth() &&
             aptDate.getFullYear() === now.getFullYear();
    })
    .reduce((acc, apt) => acc + apt.service.price, 0);

  const stats = [
    {
      title: 'Agendamentos Hoje',
      value: todayAppointments.toString(),
      icon: Calendar,
      color: 'bg-blue-500',
      trend: {
        value: `${confirmedAppointments} confirmados`,
        isPositive: true
      }
    },
    {
      title: 'Receita Semanal',
      value: formatCurrency(weekRevenue),
      icon: DollarSign,
      color: 'bg-green-500',
      trend: {
        value: `${appointments.filter(apt => 
          isToday(apt.date) && (apt.status === 'confirmed' || apt.status === 'completed')
        ).length} hoje`,
        isPositive: true
      }
    },
    {
      title: 'Receita Mensal',
      value: formatCurrency(monthRevenue),
      icon: TrendingUp,
      color: 'bg-purple-500',
      trend: {
        value: `${completedAppointments} concluídos`,
        isPositive: true
      }
    },
    {
      title: 'Pendentes',
      value: pendingAppointments.toString(),
      icon: Clock,
      color: 'bg-orange-500',
      trend: {
        value: `${cancelledAppointments} cancelados`,
        isPositive: false
      }
    }
  ];

  const activeServices = getActiveServices();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu negócio em tempo real</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAppointments />
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status dos Agendamentos</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-gray-600">Pendentes</span>
              </div>
              <span className="font-semibold text-orange-600">{pendingAppointments}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">Confirmados</span>
              </div>
              <span className="font-semibold text-green-600">{confirmedAppointments}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span className="text-gray-600">Concluídos</span>
              </div>
              <span className="font-semibold text-blue-600">{completedAppointments}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-gray-600">Cancelados</span>
              </div>
              <span className="font-semibold text-red-600">{cancelledAppointments}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-medium">Total de agendamentos</span>
                <span className="font-bold text-gray-900">{appointments.length}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-900 font-medium">Serviços ativos</span>
                <span className="font-bold text-gray-900">{activeServices.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <AppointmentsPieChart />
      </div>
    </div>
  );
};