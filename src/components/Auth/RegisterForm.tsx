import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Building, User, Phone, ArrowLeft, Upload, Copy, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterFormProps {
  onBack: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onBack }) => {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    phone: '',
    plan: 'complete' as 'essential' | 'complete',
    logo: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState<any>(null);

  const plans = {
    essential: {
      name: 'Essencial',
      price: 16.90,
      features: [
        'Agendamento online ilimitado',
        'Link personalizado',
        'Notificações WhatsApp',
        'Gestão de clientes',
        'Suporte por email'
      ]
    },
    complete: {
      name: 'Completo',
      price: 19.90,
      features: [
        'Tudo do plano Essencial',
        'Controle financeiro completo',
        'Relatórios e gráficos',
        'Gestão de serviços avançada',
        'Múltiplas formas de pagamento',
        'Suporte prioritário'
      ]
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem');
        return;
      }
      if (formData.password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    if (step === 3) {
      // Generate payment
      const payment = {
        id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tenantName: formData.businessName,
        plan: formData.plan,
        amount: plans[formData.plan].price,
        status: 'pending' as const,
        pixKey: 'admin@cicalerta.com', // PIX do administrador
        createdAt: new Date().toISOString()
      };
      
      setPaymentData(payment);
      setStep(4);
      return;
    }

    if (step === 4) {
      setIsLoading(true);
      setError('');

      try {
        const success = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          businessName: formData.businessName,
          phone: formData.phone,
          plan: formData.plan,
          logo: formData.logo
        });
        
        if (success) {
          // Save payment record
          const storedPayments = localStorage.getItem('system_payments');
          const payments = storedPayments ? JSON.parse(storedPayments) : [];
          
          // Get the created tenant ID
          const storedTenants = localStorage.getItem('system_tenants');
          if (storedTenants) {
            const tenants = JSON.parse(storedTenants);
            const newTenant = tenants.find((t: any) => t.email === formData.email);
            if (newTenant) {
              const paymentRecord = {
                ...paymentData,
                tenantId: newTenant.id
              };
              payments.push(paymentRecord);
              localStorage.setItem('system_payments', JSON.stringify(payments));
            }
          }
          
          setStep(5);
        } else {
          setError('Erro ao criar conta. Verifique os dados e tente novamente.');
        }
      } catch (err) {
        setError('Erro ao criar conta. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, logo: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText(paymentData.pixKey);
    alert('Chave PIX copiada!');
  };

  if (step === 5) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Conta Criada com Sucesso!</h2>
          <p className="text-gray-600 mb-6">
            Sua conta foi criada e está aguardando a confirmação do pagamento. 
            Você receberá acesso completo assim que o pagamento for confirmado pelo administrador.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Status:</strong> Aguardando confirmação de pagamento<br/>
              <strong>Valor:</strong> {paymentData && `R$ ${paymentData.amount.toFixed(2)}`}
            </p>
          </div>
          <button
            onClick={onBack}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={step === 1 ? onBack : () => setStep(step - 1)}
              className="p-2 hover:bg-gray-100 rounded-lg mr-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="text-center flex-1">
              <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-blue-600 rounded-full mb-4">
                <Building className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">CIC ALERTA</h1>
              <p className="text-sm lg:text-base text-gray-600">Criar nova conta</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center mb-8">
            {[1, 2, 3, 4].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-medium ${
                  step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`flex-1 h-1 mx-1 lg:mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            {step === 1 && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados do Negócio</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Negócio
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nome da sua empresa"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone/WhatsApp
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo do Negócio (opcional)
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                        <Upload className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-gray-600 text-sm">Escolher arquivo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {formData.logo && (
                      <div className="w-16 h-16 border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={formData.logo}
                          alt="Logo preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Escolha seu Plano</h2>
                
                <div className="space-y-4">
                  {Object.entries(plans).map(([key, plan]) => (
                    <div
                      key={key}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.plan === key
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, plan: key as any }))}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                          <p className="text-xl lg:text-2xl font-bold text-blue-600">
                            R$ {plan.price.toFixed(2)}<span className="text-sm text-gray-600">/mês</span>
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          formData.plan === key
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.plan === key && (
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

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>7 dias grátis!</strong> Teste todas as funcionalidades sem compromisso. 
                    Cancele quando quiser.
                  </p>
                </div>
              </>
            )}

            {step === 4 && paymentData && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Pagamento via PIX</h2>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">Dados do Pagamento</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p><strong>Plano:</strong> {plans[formData.plan].name}</p>
                    <p><strong>Valor:</strong> R$ {paymentData.amount.toFixed(2)}</p>
                    <p><strong>Período:</strong> Mensal</p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Chave PIX para Pagamento</h3>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={paymentData.pixKey}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-800 font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={copyPixKey}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copiar</span>
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Instruções:</strong><br/>
                    1. Copie a chave PIX acima<br/>
                    2. Faça o pagamento no seu banco<br/>
                    3. Finalize o cadastro clicando em "Finalizar Cadastro"<br/>
                    4. Aguarde a confirmação do administrador para ativar sua conta
                  </p>
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Criando conta...' : 
               step === 1 ? 'Continuar' :
               step === 2 ? 'Continuar' :
               step === 3 ? 'Continuar' :
               'Finalizar Cadastro'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <button
                onClick={onBack}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Fazer login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};