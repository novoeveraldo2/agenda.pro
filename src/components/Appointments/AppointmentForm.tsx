import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, CreditCard } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';
import { useServices } from '../../hooks/useServices';
import { generateTimeSlots, formatCurrency } from '../../utils/dateUtils';

export const AppointmentForm: React.FC = () => {
  const { addAppointment } = useAppointments();
  const { getActiveServices } = useServices();
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    serviceId: '',
    date: '',
    time: '',
    paymentMethod: 'cash' as 'pix' | 'card' | 'cash',
    notes: ''
  });

  const timeSlots = generateTimeSlots();
  const services = getActiveServices();
  const selectedService = services.find(s => s.id === formData.serviceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService) return;

    const appointment = {
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      service: selectedService,
      date: formData.date,
      time: formData.time,
      paymentMethod: formData.paymentMethod,
      status: 'pending' as const,
      notes: formData.notes
    };

    addAppointment(appointment);
    
    // Reset form
    setFormData({
      clientName: '',
      clientPhone: '',
      serviceId: '',
      date: '',
      time: '',
      paymentMethod: 'cash',
      notes: ''
    });

    alert('Agendamento criado com sucesso! Uma mensagem foi enviada via WhatsApp.');
  };

  const isFormValid = formData.clientName && formData.clientPhone && formData.serviceId && 
                     formData.date && formData.time;

  if (services.length === 0) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Novo Agendamento</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-800">
              Você precisa cadastrar pelo menos um serviço ativo antes de criar agendamentos.
            </p>
            <p className="text-yellow-600 mt-2">
              Vá para a seção "Gerenciar Serviços" para adicionar seus serviços.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Novo Agendamento</h1>
          <p className="text-gray-600">Preencha os dados para criar um novo agendamento</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
          {/* Cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Nome do Cliente
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite o nome do cliente"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Telefone
              </label>
              <input
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(11) 99999-9999"
                required
              />
            </div>
          </div>

          {/* Serviço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Serviço
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.serviceId === service.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, serviceId: service.id }))}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{service.name}</h3>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  <p className="text-xs text-gray-500">{service.duration} minutos</p>
                </div>
              ))}
            </div>
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Data
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Horário
              </label>
              <select
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione um horário</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              <CreditCard className="w-4 h-4 inline mr-1" />
              Forma de Pagamento
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'cash', label: 'Dinheiro', emoji: '💵' },
                { id: 'pix', label: 'PIX', emoji: '📱' },
                { id: 'card', label: 'Cartão', emoji: '💳' }
              ].map((method) => (
                <div
                  key={method.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                    formData.paymentMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id as any }))}
                >
                  <div className="text-2xl mb-2">{method.emoji}</div>
                  <div className="font-medium text-gray-900">{method.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações (opcional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Alguma observação adicional..."
            />
          </div>

          {/* Resumo */}
          {selectedService && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Resumo do Agendamento</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Serviço:</strong> {selectedService.name}</p>
                <p><strong>Duração:</strong> {selectedService.duration} minutos</p>
                <p><strong>Valor:</strong> {formatCurrency(selectedService.price)}</p>
                {formData.date && <p><strong>Data:</strong> {new Date(formData.date).toLocaleDateString('pt-BR')}</p>}
                {formData.time && <p><strong>Horário:</strong> {formData.time}</p>}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Criar Agendamento
          </button>
        </form>
      </div>
    </div>
  );
};