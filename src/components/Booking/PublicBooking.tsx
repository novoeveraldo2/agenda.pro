import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, CreditCard, MapPin, Building, ArrowLeft, CheckCircle, Download } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Service, TenantProfile, Tenant } from '../../types';
import { generateTimeSlots, formatCurrency } from '../../utils/dateUtils';

export const PublicBooking: React.FC = () => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [profile, setProfile] = useState<TenantProfile | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [step, setStep] = useState(1);
  const [showPWAPrompt, setShowPWAPrompt] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    serviceId: '',
    date: '',
    time: '',
    paymentMethod: 'cash' as 'pix' | 'card' | 'cash',
    notes: ''
  });

  useEffect(() => {
    if (tenantId) {
      // Load tenant info
      const storedTenants = localStorage.getItem('system_tenants');
      if (storedTenants) {
        const tenants = JSON.parse(storedTenants);
        const foundTenant = tenants.find((t: Tenant) => t.id === tenantId);
        if (foundTenant && foundTenant.isActive) {
          setTenant(foundTenant);
        }
      }

      // Load services
      const storedServices = localStorage.getItem(`services_${tenantId}`);
      if (storedServices) {
        try {
          const parsedServices = JSON.parse(storedServices);
          setServices(parsedServices.filter((s: Service) => s.isActive));
        } catch (error) {
          console.error('Error parsing services:', error);
        }
      }

      // Load profile
      const storedProfile = localStorage.getItem(`profile_${tenantId}`);
      if (storedProfile) {
        try {
          setProfile(JSON.parse(storedProfile));
        } catch (error) {
          console.error('Error parsing profile:', error);
        }
      }
    }

    // Check if PWA prompt should be shown
    const hasShownPWAPrompt = localStorage.getItem(`pwa_prompt_${tenantId}`);
    if (!hasShownPWAPrompt && 'serviceWorker' in navigator) {
      setTimeout(() => setShowPWAPrompt(true), 3000);
    }
  }, [tenantId]);

  const timeSlots = generateTimeSlots();
  const selectedService = services.find(s => s.id === formData.serviceId);
  const primaryColor = profile?.primaryColor || '#2563eb';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    if (step === 3) {
      if (!selectedService || !tenantId) return;

      // Create appointment
      const appointment = {
        id: `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        service: selectedService,
        date: formData.date,
        time: formData.time,
        paymentMethod: formData.paymentMethod,
        status: 'pending' as const,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        tenantId: tenantId,
        paymentConfirmed: false
      };

      // Save to localStorage
      const storedAppointments = localStorage.getItem(`appointments_${tenantId}`);
      const appointments = storedAppointments ? JSON.parse(storedAppointments) : [];
      appointments.push(appointment);
      localStorage.setItem(`appointments_${tenantId}`, JSON.stringify(appointments));

      // Create WhatsApp message
      const businessPhone = profile?.phone?.replace(/\D/g, '') || '';
      const message = `🎉 *Novo Agendamento - ${tenant?.name || profile?.businessName}!*\n\n👤 Cliente: ${formData.clientName}\n📞 Telefone: ${formData.clientPhone}\n✂️ Serviço: ${selectedService.name}\n📅 Data: ${new Date(formData.date).toLocaleDateString('pt-BR')}\n⏰ Horário: ${formData.time}\n💰 Valor: R$ ${selectedService.price.toFixed(2)}\n💳 Pagamento: ${formData.paymentMethod === 'pix' ? 'PIX' : formData.paymentMethod === 'card' ? 'Cartão' : 'Dinheiro'}${formData.notes ? `\n📝 Obs: ${formData.notes}` : ''}`;
      
      const whatsappUrl = businessPhone 
        ? `https://wa.me/55${businessPhone}?text=${encodeURIComponent(message)}`
        : `https://wa.me/?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
      
      setStep(4);
    }
  };

  const isFormValid = () => {
    if (step === 1) {
      return formData.clientName && formData.clientPhone;
    }
    if (step === 2) {
      return formData.serviceId;
    }
    if (step === 3) {
      return formData.date && formData.time;
    }
    return false;
  };

  const availablePaymentMethods = [
    { id: 'cash', label: 'Dinheiro', emoji: '💵', enabled: profile?.paymentMethods?.cash },
    { id: 'pix', label: 'PIX', emoji: '📱', enabled: profile?.paymentMethods?.pix },
    { id: 'card', label: 'Cartão', emoji: '💳', enabled: profile?.paymentMethods?.card }
  ].filter(method => method.enabled);

  const dismissPWAPrompt = () => {
    setShowPWAPrompt(false);
    localStorage.setItem(`pwa_prompt_${tenantId}`, 'true');
  };

  const installPWA = () => {
    // Generate custom manifest for this business
    const customManifest = {
      name: profile?.businessName || tenant?.name || 'Agendamento Online',
      short_name: (profile?.businessName || tenant?.name || 'Agenda').substring(0, 12),
      description: `Agendamento online para ${profile?.businessName || tenant?.name}`,
      start_url: window.location.pathname,
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: primaryColor,
      orientation: 'portrait-primary',
      icons: [
        {
          src: profile?.logo || '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable any'
        },
        {
          src: profile?.logo || '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable any'
        }
      ]
    };

    // Create and download manifest
    const blob = new Blob([JSON.stringify(customManifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.json';
    a.click();
    URL.revokeObjectURL(url);

    dismissPWAPrompt();
    alert('Arquivo baixado! Siga as instruções do seu navegador para instalar o aplicativo.');
  };

  if (!tenant || !tenant.isActive) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-4">Estabelecimento Indisponível</h2>
          <p className="text-gray-600">
            Este estabelecimento não está disponível para agendamentos no momento.
          </p>
        </div>
      </div>
    );
  }

  if (!profile && !tenant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Agendamento Realizado!</h2>
          <p className="text-gray-600 mb-6">
            Seu agendamento foi enviado com sucesso. O estabelecimento entrará em contato via WhatsApp para confirmar.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Resumo do Agendamento</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Cliente:</strong> {formData.clientName}</p>
              <p><strong>Serviço:</strong> {selectedService?.name}</p>
              <p><strong>Data:</strong> {new Date(formData.date).toLocaleDateString('pt-BR')}</p>
              <p><strong>Horário:</strong> {formData.time}</p>
              <p><strong>Valor:</strong> {selectedService && formatCurrency(selectedService.price)}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full text-white py-3 rounded-lg hover:opacity-90 transition-colors"
            style={{ backgroundColor: primaryColor }}
          >
            Fazer Novo Agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ '--primary-color': primaryColor } as React.CSSProperties}>
      {/* PWA Installation Prompt */}
      {showPWAPrompt && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-white rounded-lg shadow-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Download className="w-6 h-6" style={{ color: primaryColor }} />
              <div>
                <h3 className="font-semibold text-gray-900">Instalar Aplicativo</h3>
                <p className="text-sm text-gray-600">Adicione à tela inicial para acesso rápido</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={installPWA}
                className="px-3 py-1 text-white rounded text-sm"
                style={{ backgroundColor: primaryColor }}
              >
                Instalar
              </button>
              <button
                onClick={dismissPWAPrompt}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm"
              >
                Agora não
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 lg:py-6">
          <div className="flex items-center space-x-4">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            {profile?.logo && (
              <img
                src={profile.logo}
                alt={profile.businessName}
                className="w-12 h-12 lg:w-16 lg:h-16 object-contain rounded-lg border border-gray-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div className="flex-1">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                {profile?.businessName || tenant?.name || 'Agendamento Online'}
              </h1>
              {profile?.description && (
                <p className="text-gray-600 mt-1 text-sm lg:text-base">{profile.description}</p>
              )}
              <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mt-2 text-sm text-gray-500 space-y-1 lg:space-y-0">
                {profile?.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile?.address && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`flex items-center ${stepNumber < 3 ? 'flex-1' : ''}`}>
                  <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-medium ${
                    step >= stepNumber ? 'text-white' : 'bg-gray-200 text-gray-600'
                  }`} style={step >= stepNumber ? { backgroundColor: primaryColor } : {}}>
                    {stepNumber}
                  </div>
                  <span className={`ml-2 text-xs lg:text-sm font-medium ${
                    step >= stepNumber ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {stepNumber === 1 ? 'Dados' : stepNumber === 2 ? 'Serviço' : 'Data/Hora'}
                  </span>
                </div>
                {stepNumber < 3 && (
                  <div className={`flex-1 h-1 mx-2 lg:mx-4 ${
                    step > stepNumber ? 'bg-gray-200' : 'bg-gray-200'
                  }`} style={step > stepNumber ? { backgroundColor: primaryColor } : {}} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 lg:py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8">
          {services.length === 0 ? (
            <div className="text-center py-12">
              <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum serviço disponível</h3>
              <p className="text-gray-500">Este estabelecimento ainda não cadastrou serviços para agendamento.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
              {step === 1 && (
                <>
                  <div className="text-center mb-6 lg:mb-8">
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Seus Dados</h2>
                    <p className="text-gray-600">Informe seus dados para o agendamento</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Seu Nome
                      </label>
                      <input
                        type="text"
                        value={formData.clientName}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                        placeholder="Digite seu nome completo"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Seu Telefone
                      </label>
                      <input
                        type="tel"
                        value={formData.clientPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="text-center mb-6 lg:mb-8">
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Escolha o Serviço</h2>
                    <p className="text-gray-600">Selecione o serviço desejado</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className={`p-4 lg:p-6 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.serviceId === service.id
                            ? 'bg-opacity-10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={formData.serviceId === service.id ? { 
                          borderColor: primaryColor, 
                          backgroundColor: primaryColor + '1A' 
                        } : {}}
                        onClick={() => setFormData(prev => ({ ...prev, serviceId: service.id }))}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <span className="text-lg lg:text-xl font-bold text-green-600">
                            {formatCurrency(service.price)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                        <p className="text-xs text-gray-500">⏱️ {service.duration} minutos</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="text-center mb-6 lg:mb-8">
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Data e Horário</h2>
                    <p className="text-gray-600">Escolha quando deseja ser atendido</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Data Desejada
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Horário Desejado
                      </label>
                      <select
                        value={formData.time}
                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
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
                  {availablePaymentMethods.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        <CreditCard className="w-4 h-4 inline mr-1" />
                        Forma de Pagamento
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {availablePaymentMethods.map((method) => (
                          <div
                            key={method.id}
                            className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                              formData.paymentMethod === method.id
                                ? 'bg-opacity-10'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            style={formData.paymentMethod === method.id ? { 
                              borderColor: primaryColor, 
                              backgroundColor: primaryColor + '1A' 
                            } : {}}
                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id as any }))}
                          >
                            <div className="text-2xl mb-2">{method.emoji}</div>
                            <div className="font-medium text-gray-900">{method.label}</div>
                          </div>
                        ))}
                      </div>
                      
                      {formData.paymentMethod === 'pix' && profile?.paymentMethods?.pixKey && (
                        <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: primaryColor + '1A' }}>
                          <p className="text-sm mb-2" style={{ color: primaryColor }}>
                            <strong>Chave PIX:</strong> {profile.paymentMethods.pixKey}
                          </p>
                          <p className="text-xs" style={{ color: primaryColor }}>
                            Você pode fazer o pagamento antecipado usando esta chave PIX
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Observações */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observações (opcional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                      placeholder="Alguma observação ou preferência especial..."
                    />
                  </div>

                  {/* Resumo */}
                  {selectedService && (
                    <div className="bg-gray-50 rounded-lg p-4 lg:p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Resumo do Agendamento</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Cliente:</strong> {formData.clientName}</p>
                        <p><strong>Telefone:</strong> {formData.clientPhone}</p>
                        <p><strong>Serviço:</strong> {selectedService.name}</p>
                        <p><strong>Duração:</strong> {selectedService.duration} minutos</p>
                        <p><strong>Valor:</strong> {formatCurrency(selectedService.price)}</p>
                        {formData.date && <p><strong>Data:</strong> {new Date(formData.date).toLocaleDateString('pt-BR')}</p>}
                        {formData.time && <p><strong>Horário:</strong> {formData.time}</p>}
                        <p><strong>Pagamento:</strong> {availablePaymentMethods.find(m => m.id === formData.paymentMethod)?.label}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                disabled={!isFormValid()}
                className="w-full text-white py-3 lg:py-4 px-6 rounded-lg font-semibold text-lg hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                style={{ backgroundColor: isFormValid() ? primaryColor : undefined }}
              >
                {step === 1 ? 'Continuar' : step === 2 ? 'Continuar' : 'Confirmar Agendamento'}
              </button>

              {step === 3 && (
                <p className="text-xs text-gray-500 text-center">
                  Ao confirmar, você será redirecionado para o WhatsApp para finalizar o agendamento
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};