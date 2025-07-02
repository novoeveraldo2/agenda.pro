import React, { useState, useEffect } from 'react';
import { Crown, Clock, CreditCard, MessageCircle, CheckCircle, AlertTriangle, Copy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../utils/dateUtils';

export const PlanStatus: React.FC = () => {
  const { tenant } = useAuth();
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'essential' | 'complete'>('complete');
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    if (tenant) {
      const expiryDate = new Date(tenant.expiresAt);
      const today = new Date();
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysRemaining(Math.max(0, diffDays));
    }
  }, [tenant]);

  const plans = {
    essential: {
      name: 'Essencial',
      price: 16.90,
      features: [
        'Página de agendamento personalizada',
        'Agendamento online ilimitado',
        'Link personalizado',
        'Notificações WhatsApp',
        'Gestão básica de clientes'
      ]
    },
    complete: {
      name: 'Completo',
      price: 19.90,
      features: [
        'Tudo do plano Essencial',
        'Controle financeiro completo',
        'Relatórios e gráficos',
        'Gestão avançada de serviços',
        'Suporte prioritário'
      ]
    }
  };

  const handlePayment = () => {
    const payment = {
      id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId: tenant?.id,
      tenantName: tenant?.name,
      plan: selectedPlan,
      amount: plans[selectedPlan].price,
      status: 'pending' as const,
      pixKey: 'novoeveraldo5@gmail.com',
      createdAt: new Date().toISOString()
    };

    setPaymentData(payment);

    // Save payment record
    const storedPayments = localStorage.getItem('system_payments');
    const payments = storedPayments ? JSON.parse(storedPayments) : [];
    payments.push(payment);
    localStorage.setItem('system_payments', JSON.stringify(payments));

    // Create WhatsApp message
    const message = `💳 *Novo Pagamento - CIC ALERTA*\n\n🏢 Comerciante: ${tenant?.name}\n📧 Email: ${tenant?.email}\n📞 Telefone: ${tenant?.phone}\n\n💰 Plano: ${plans[selectedPlan].name}\n💵 Valor: R$ ${plans[selectedPlan].price.toFixed(2)}\n\n🔑 Chave PIX: novoeveraldo5@gmail.com\n\nPor favor, confirme o pagamento para ativar o plano.`;
    
    const whatsappUrl = `https://wa.me/5541996772512?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText('novoeveraldo5@gmail.com');
    alert('Chave PIX copiada!');
  };

  const checkPaymentStatus = () => {
    // Simulate checking payment status
    const storedPayments = localStorage.getItem('system_payments');
    if (storedPayments) {
      const payments = JSON.parse(storedPayments);
      const recentPayment = payments.find((p: any) => 
        p.tenantId === tenant?.id && 
        p.status === 'confirmed' &&
        new Date(p.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 // Last 24 hours
      );

      if (recentPayment) {
        alert('Pagamento confirmado! Seu plano foi ativado.');
        window.location.reload();
      } else {
        alert('Pagamento ainda não foi confirmado. Aguarde ou entre em contato conosco.');
      }
    }
  };

  if (!tenant) return null;

  const isExpired = daysRemaining <= 0;
  const isExpiringSoon = daysRemaining <= 3 && daysRemaining > 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Meu Plano</h1>
        <p className="text-gray-600">Gerencie sua assinatura e funcionalidades</p>
      </div>

      {/* Current Plan Status */}
      <div className={`rounded-xl p-6 border-2 ${
        isExpired ? 'bg-red-50 border-red-200' : 
        isExpiringSoon ? 'bg-yellow-50 border-yellow-200' : 
        'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isExpired ? 'bg-red-100' : 
              isExpiringSoon ? 'bg-yellow-100' : 
              'bg-green-100'
            }`}>
              {isExpired ? (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              ) : (
                <Crown className="w-6 h-6 text-green-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Plano {tenant.plan === 'essential' ? 'Essencial' : 'Completo'}
              </h2>
              <p className={`text-sm ${
                isExpired ? 'text-red-600' : 
                isExpiringSoon ? 'text-yellow-600' : 
                'text-green-600'
              }`}>
                {isExpired ? 'Plano expirado' : 
                 isExpiringSoon ? `Expira em ${daysRemaining} dias` : 
                 `${daysRemaining} dias restantes`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(plans[tenant.plan].price)}
            </p>
            <p className="text-sm text-gray-600">/mês</p>
          </div>
        </div>

        {(isExpired || isExpiringSoon) && (
          <div className={`p-4 rounded-lg ${
            isExpired ? 'bg-red-100' : 'bg-yellow-100'
          } mb-4`}>
            <p className={`text-sm font-medium ${
              isExpired ? 'text-red-800' : 'text-yellow-800'
            }`}>
              {isExpired ? 
                '⚠️ Seu plano expirou! Renove agora para continuar usando todas as funcionalidades.' :
                '⏰ Seu plano expira em breve! Renove para não perder o acesso.'
              }
            </p>
          </div>
        )}

        {/* Countdown Timer */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Tempo restante:</span>
            </div>
            <div className={`text-2xl font-bold ${
              isExpired ? 'text-red-600' : 
              isExpiringSoon ? 'text-yellow-600' : 
              'text-green-600'
            }`}>
              {isExpired ? 'EXPIRADO' : `${daysRemaining} dias`}
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowPayment(true)}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {isExpired ? 'Renovar Plano' : 'Renovar ou Fazer Upgrade'}
          </button>
          <button
            onClick={checkPaymentStatus}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Verificar Pagamento
          </button>
        </div>
      </div>

      {/* Current Plan Features */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Funcionalidades do Seu Plano</h3>
        <div className="space-y-3">
          {plans[tenant.plan].features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Renovar/Upgrade do Plano</h2>
                <button
                  onClick={() => setShowPayment(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Escolha seu plano:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(plans).map(([key, plan]) => (
                      <div
                        key={key}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedPlan === key
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPlan(key as any)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                            <p className="text-2xl font-bold text-blue-600">
                              {formatCurrency(plan.price)}<span className="text-sm text-gray-600">/mês</span>
                            </p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 ${
                            selectedPlan === key
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedPlan === key && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                        </div>
                        <ul className="space-y-1">
                          {plan.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                              {feature}
                            </li>
                          ))}
                          {plan.features.length > 3 && (
                            <li className="text-sm text-gray-500">
                              +{plan.features.length - 3} funcionalidades
                            </li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Pagamento via PIX</h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p><strong>Valor:</strong> {formatCurrency(plans[selectedPlan].price)}</p>
                    <div className="flex items-center space-x-2">
                      <span><strong>Chave PIX:</strong> novoeveraldo5@gmail.com</span>
                      <button
                        onClick={copyPixKey}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Copiar chave PIX"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p><strong>Período:</strong> 30 dias</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Como funciona:</strong><br/>
                    1. Faça o pagamento via PIX usando a chave acima<br/>
                    2. Clique em "Enviar Comprovante" para notificar o administrador<br/>
                    3. Seu plano será ativado em até 24 horas<br/>
                    4. Use "Verificar Pagamento" para checar o status
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowPayment(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handlePayment}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Enviar Comprovante</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};