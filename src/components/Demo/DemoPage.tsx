import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Building,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  BarChart3,
  MessageCircle
} from 'lucide-react';

interface DemoPageProps {
  onBack: () => void;
}

export const DemoPage: React.FC<DemoPageProps> = ({ onBack }) => {
  const [activeDemo, setActiveDemo] = useState<'merchant' | 'client' | 'admin'>('merchant');

  const demoStats = {
    todayAppointments: 8,
    weekRevenue: 1250.00,
    monthRevenue: 4800.00,
    pendingAppointments: 3
  };

  const demoAppointments = [
    {
      id: '1',
      clientName: 'Maria Silva',
      clientPhone: '(11) 99999-1234',
      service: { name: 'Corte + Escova', price: 45.00, duration: 60 },
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      status: 'confirmed' as const
    },
    {
      id: '2',
      clientName: 'João Santos',
      clientPhone: '(11) 99999-5678',
      service: { name: 'Corte Masculino', price: 25.00, duration: 30 },
      date: new Date().toISOString().split('T')[0],
      time: '10:30',
      status: 'pending' as const
    },
    {
      id: '3',
      clientName: 'Ana Costa',
      clientPhone: '(11) 99999-9012',
      service: { name: 'Manicure', price: 20.00, duration: 45 },
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      status: 'confirmed' as const
    }
  ];

  const demoServices = [
    { id: '1', name: 'Corte Feminino', price: 35.00, duration: 45, description: 'Corte moderno e estiloso' },
    { id: '2', name: 'Corte Masculino', price: 25.00, duration: 30, description: 'Corte tradicional ou moderno' },
    { id: '3', name: 'Escova', price: 20.00, duration: 30, description: 'Escova modeladora' },
    { id: '4', name: 'Manicure', price: 20.00, duration: 45, description: 'Cuidado completo das unhas' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendente';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  const renderMerchantDemo = () => (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Agendamentos Hoje</p>
              <p className="text-2xl font-bold text-gray-900">{demoStats.todayAppointments}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Receita Semanal</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(demoStats.weekRevenue)}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Receita Mensal</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(demoStats.monthRevenue)}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">{demoStats.pendingAppointments}</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-500">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Agendamentos de Hoje</h3>
        <div className="space-y-4">
          {demoAppointments.map((appointment) => (
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
                  <span>{appointment.time}</span>
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3 h-3" />
                    <span>{appointment.clientPhone}</span>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatCurrency(appointment.service.price)}</p>
                <p className="text-xs text-gray-500">{appointment.service.duration} min</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Serviços Oferecidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoServices.map((service) => (
            <div key={service.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{service.name}</h4>
                <span className="text-lg font-bold text-green-600">{formatCurrency(service.price)}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{service.description}</p>
              <p className="text-xs text-gray-500">{service.duration} minutos</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderClientDemo = () => (
    <div className="max-w-2xl mx-auto">
      {/* Business Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Salão Beleza & Estilo</h2>
            <p className="text-gray-600">Cuidando da sua beleza com carinho</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>(11) 99999-0000</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>Rua das Flores, 123</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Agendar Serviço</h3>
        
        <div className="space-y-6">
          {/* Client Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seu Nome</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite seu nome"
                value="Maria Silva"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seu Telefone</label>
              <input
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(11) 99999-9999"
                value="(11) 99999-1234"
                readOnly
              />
            </div>
          </div>

          {/* Services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Escolha o Serviço</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {demoServices.slice(0, 2).map((service, index) => (
                <div
                  key={service.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    index === 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <span className="text-lg font-bold text-green-600">{formatCurrency(service.price)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  <p className="text-xs text-gray-500">⏱️ {service.duration} minutos</p>
                </div>
              ))}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={new Date().toISOString().split('T')[0]}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Horário</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Forma de Pagamento</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'pix', label: 'PIX', emoji: '📱' },
                { id: 'card', label: 'Cartão', emoji: '💳' },
                { id: 'cash', label: 'Dinheiro', emoji: '💵' }
              ].map((method, index) => (
                <div
                  key={method.id}
                  className={`p-4 border-2 rounded-lg text-center cursor-pointer transition-all ${
                    index === 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="text-2xl mb-2">{method.emoji}</div>
                  <div className="font-medium text-gray-900">{method.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Resumo do Agendamento</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Serviço:</strong> Corte Feminino</p>
              <p><strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
              <p><strong>Horário:</strong> 09:00</p>
              <p><strong>Duração:</strong> 45 minutos</p>
              <p><strong>Valor:</strong> R$ 35,00</p>
              <p><strong>Pagamento:</strong> PIX</p>
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Confirmar Agendamento
          </button>
        </div>
      </div>
    </div>
  );

  const renderAdminDemo = () => (
    <div className="space-y-6">
      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Comerciantes Ativos</p>
              <p className="text-2xl font-bold text-gray-900">127</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <Building className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Usuários Totais</p>
              <p className="text-2xl font-bold text-gray-900">342</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Receita Mensal</p>
              <p className="text-2xl font-bold text-gray-900">R$ 2.847,30</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Agendamentos Hoje</p>
              <p className="text-2xl font-bold text-gray-900">1.234</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-500">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Merchants */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comerciantes Recentes</h3>
        <div className="space-y-4">
          {[
            { name: 'Salão Beleza & Estilo', plan: 'Completo', status: 'Ativo', revenue: 'R$ 89,70' },
            { name: 'Barbearia do João', plan: 'Essencial', status: 'Ativo', revenue: 'R$ 50,70' },
            { name: 'Estética Ana', plan: 'Completo', status: 'Pendente', revenue: 'R$ 0,00' }
          ].map((merchant, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{merchant.name}</h4>
                <p className="text-sm text-gray-600">Plano {merchant.plan}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  merchant.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {merchant.status}
                </span>
                <p className="text-sm text-gray-600 mt-1">{merchant.revenue}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Demonstração CIC ALERTA</h1>
                <p className="text-sm text-gray-600">Explore todas as funcionalidades do sistema</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveDemo('merchant')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeDemo === 'merchant'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Painel do Comerciante
            </button>
            <button
              onClick={() => setActiveDemo('client')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeDemo === 'client'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Agendamento do Cliente
            </button>
            <button
              onClick={() => setActiveDemo('admin')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeDemo === 'admin'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Painel Administrativo
            </button>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {activeDemo === 'merchant' && 'Painel do Comerciante'}
            {activeDemo === 'client' && 'Experiência do Cliente'}
            {activeDemo === 'admin' && 'Painel Administrativo'}
          </h2>
          <p className="text-gray-600">
            {activeDemo === 'merchant' && 'Veja como o comerciante gerencia seu negócio'}
            {activeDemo === 'client' && 'Veja como é fácil para o cliente agendar'}
            {activeDemo === 'admin' && 'Veja como o administrador gerencia a plataforma'}
          </p>
        </div>

        {activeDemo === 'merchant' && renderMerchantDemo()}
        {activeDemo === 'client' && renderClientDemo()}
        {activeDemo === 'admin' && renderAdminDemo()}
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-2xl font-bold mb-4">Gostou do que viu?</h3>
          <p className="text-blue-100 mb-6">
            Comece a usar o CIC ALERTA hoje mesmo e transforme seu negócio!
          </p>
          <button
            onClick={onBack}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Criar Minha Conta Grátis
          </button>
        </div>
      </div>
    </div>
  );
};