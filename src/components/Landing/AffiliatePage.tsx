import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calculator,
  CheckCircle,
  Star,
  Target,
  Award,
  Zap
} from 'lucide-react';

interface AffiliatePageProps {
  onBack: () => void;
}

export const AffiliatePage: React.FC<AffiliatePageProps> = ({ onBack }) => {
  const [salesCount, setSalesCount] = useState(10);
  const [selectedPlan, setSelectedPlan] = useState<'essential' | 'complete' | 'mixed'>('mixed');
  const [config, setConfig] = useState({
    plans: {
      essential: { price: 16.90 },
      complete: { price: 19.90 }
    },
    affiliate: {
      commission: 30
    }
  });

  useEffect(() => {
    // Load admin config
    const storedConfig = localStorage.getItem('admin_config');
    if (storedConfig) {
      try {
        const parsedConfig = JSON.parse(storedConfig);
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Error loading config:', error);
      }
    }

    // Listen for config updates
    const handleConfigUpdate = (event: any) => {
      setConfig(event.detail);
    };

    window.addEventListener('adminConfigUpdated', handleConfigUpdate);
    return () => window.removeEventListener('adminConfigUpdated', handleConfigUpdate);
  }, []);

  const calculateEarnings = () => {
    const commission = config.affiliate.commission / 100;
    
    switch (selectedPlan) {
      case 'essential':
        return salesCount * config.plans.essential.price * commission;
      case 'complete':
        return salesCount * config.plans.complete.price * commission;
      case 'mixed':
        // 60% complete, 40% essential
        const completeEarnings = (salesCount * 0.6) * config.plans.complete.price * commission;
        const essentialEarnings = (salesCount * 0.4) * config.plans.essential.price * commission;
        return completeEarnings + essentialEarnings;
      default:
        return 0;
    }
  };

  const benefits = [
    {
      icon: DollarSign,
      title: `${config.affiliate.commission}% de Comissão`,
      description: 'Ganhe uma comissão generosa em cada venda realizada'
    },
    {
      icon: Zap,
      title: 'Pagamento Rápido',
      description: 'Receba suas comissões em até 7 dias após a confirmação'
    },
    {
      icon: Target,
      title: 'Material de Apoio',
      description: 'Acesso a materiais promocionais e treinamentos exclusivos'
    },
    {
      icon: Award,
      title: 'Suporte Dedicado',
      description: 'Equipe especializada para ajudar você a vender mais'
    }
  ];

  const testimonials = [
    {
      name: 'Carlos Silva',
      earnings: 'R$ 2.847,00',
      period: 'último mês',
      text: 'Consegui uma renda extra excelente indicando o CIC ALERTA para salões da minha região!'
    },
    {
      name: 'Ana Santos',
      earnings: 'R$ 1.923,00',
      period: 'último mês',
      text: 'Sistema fácil de vender, os clientes adoram as funcionalidades!'
    },
    {
      name: 'Roberto Lima',
      earnings: 'R$ 3.456,00',
      period: 'último mês',
      text: 'Melhor programa de afiliados que já participei. Recomendo!'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Programa de Afiliados CIC ALERTA</h1>
              <p className="text-sm text-gray-600">Ganhe dinheiro indicando nossa solução</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Seja um Afiliado CIC ALERTA
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Ganhe até R$ {(config.plans.complete.price * config.affiliate.commission / 100).toFixed(2)} por venda e construa uma renda extra sólida
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg">
              Quero Ser Afiliado
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold text-lg">
              Saiba Mais
            </button>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Calculadora de Ganhos
            </h3>
            <p className="text-xl text-gray-600">
              Simule seus ganhos mensais como afiliado
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de vendas por mês
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={salesCount}
                    onChange={(e) => setSalesCount(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>1</span>
                    <span className="font-medium text-gray-900">{salesCount} vendas</span>
                    <span>50</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipo de plano vendido
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        value="essential"
                        checked={selectedPlan === 'essential'}
                        onChange={(e) => setSelectedPlan(e.target.value as any)}
                        className="text-blue-600"
                      />
                      <span>Apenas Essencial (R$ {config.plans.essential.price.toFixed(2)})</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        value="complete"
                        checked={selectedPlan === 'complete'}
                        onChange={(e) => setSelectedPlan(e.target.value as any)}
                        className="text-blue-600"
                      />
                      <span>Apenas Completo (R$ {config.plans.complete.price.toFixed(2)})</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        value="mixed"
                        checked={selectedPlan === 'mixed'}
                        onChange={(e) => setSelectedPlan(e.target.value as any)}
                        className="text-blue-600"
                      />
                      <span>Misto (60% Completo, 40% Essencial)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
                <div className="text-center">
                  <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Seus Ganhos Mensais</h4>
                  <div className="text-4xl font-bold text-green-600 mb-4">
                    R$ {calculateEarnings().toFixed(2)}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Comissão: {config.affiliate.commission}%</p>
                    <p>Vendas: {salesCount} por mês</p>
                    <p>Ganho por venda: R$ {(calculateEarnings() / salesCount).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Vantagens de Ser Nosso Afiliado
            </h3>
            <p className="text-xl text-gray-600">
              Oferecemos as melhores condições do mercado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Nossos Afiliados Estão Ganhando
            </h3>
            <p className="text-xl text-gray-600">
              Veja os resultados reais de quem já faz parte do programa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-green-600 font-bold">{testimonial.earnings} no {testimonial.period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-4xl font-bold text-white mb-6">
            Pronto para Começar a Ganhar?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Cadastre-se agora e comece a ganhar comissões hoje mesmo!
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg">
            Quero Ser Afiliado Agora
          </button>
          <p className="text-blue-100 text-sm mt-4">
            Sem taxas de adesão • Suporte completo • Pagamento garantido
          </p>
        </div>
      </section>
    </div>
  );
};