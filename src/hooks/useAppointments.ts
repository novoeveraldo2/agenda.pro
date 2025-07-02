import { useState, useEffect } from 'react';
import { Appointment, Service } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from './useTransactions';

export const useAppointments = () => {
  const { tenant } = useAuth();
  const { addTransaction } = useTransactions();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Load appointments when tenant changes
  useEffect(() => {
    if (tenant) {
      const stored = localStorage.getItem(`appointments_${tenant.id}`);
      if (stored) {
        try {
          const parsedAppointments = JSON.parse(stored);
          setAppointments(parsedAppointments);
          console.log(`Loaded ${parsedAppointments.length} appointments for tenant ${tenant.id}`);
        } catch (error) {
          console.error('Error parsing appointments from localStorage:', error);
          setAppointments([]);
        }
      } else {
        setAppointments([]);
      }
    }
  }, [tenant]);

  const saveAppointments = (newAppointments: Appointment[]) => {
    if (tenant) {
      try {
        setAppointments(newAppointments);
        localStorage.setItem(`appointments_${tenant.id}`, JSON.stringify(newAppointments));
        console.log(`Saved ${newAppointments.length} appointments for tenant ${tenant.id}`);
      } catch (error) {
        console.error('Error saving appointments to localStorage:', error);
      }
    }
  };

  const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt' | 'tenantId'>) => {
    if (!tenant) {
      console.error('No tenant found, cannot add appointment');
      return null;
    }

    const newAppointment: Appointment = {
      ...appointment,
      id: `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      tenantId: tenant.id,
      paymentConfirmed: false
    };
    
    const updated = [...appointments, newAppointment];
    saveAppointments(updated);
    
    // Simulate WhatsApp message
    const message = `🎉 *Novo Agendamento - ${tenant.name}!*\n\n👤 Cliente: ${appointment.clientName}\n📞 Telefone: ${appointment.clientPhone}\n✂️ Serviço: ${appointment.service.name}\n📅 Data: ${new Date(appointment.date).toLocaleDateString('pt-BR')}\n⏰ Horário: ${appointment.time}\n💰 Valor: R$ ${appointment.service.price.toFixed(2)}\n💳 Pagamento: ${appointment.paymentMethod === 'pix' ? 'PIX' : appointment.paymentMethod === 'card' ? 'Cartão' : 'Dinheiro'}${appointment.notes ? `\n📝 Obs: ${appointment.notes}` : ''}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    console.log('New appointment added:', newAppointment);
    return newAppointment;
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    const appointment = appointments.find(apt => apt.id === id);
    if (!appointment) return;

    const updated = appointments.map(apt => 
      apt.id === id ? { ...apt, ...updates } : apt
    );
    
    // Handle automatic financial transactions
    if (updates.status === 'confirmed' && appointment.status !== 'confirmed' && !appointment.paymentConfirmed) {
      // Add income transaction when appointment is confirmed
      addTransaction({
        type: 'income',
        description: `Agendamento confirmado - ${appointment.clientName} - ${appointment.service.name}`,
        amount: appointment.service.price,
        category: 'Serviços',
        date: new Date().toISOString().split('T')[0],
        appointmentId: id,
        isAutomatic: true
      });
      
      // Mark payment as confirmed
      updated.forEach(apt => {
        if (apt.id === id) {
          apt.paymentConfirmed = true;
        }
      });
    }

    saveAppointments(updated);
    console.log(`Updated appointment ${id}:`, updates);
  };

  const deleteAppointment = (id: string) => {
    const updated = appointments.filter(apt => apt.id !== id);
    saveAppointments(updated);
    console.log(`Deleted appointment ${id}`);
  };

  return {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment
  };
};