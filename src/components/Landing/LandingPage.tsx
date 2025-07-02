import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Smartphone, 
  CheckCircle, 
  Star,
  ArrowRight,
  Building,
  Clock,
  CreditCard,
  BarChart3,
  MessageCircle,
  Shield,
  Zap,
  Scissors,
  Heart,
  Car,
  Home,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { LoginForm } from '../Auth/LoginForm';
import { RegisterForm } from '../Auth/RegisterForm';
import { DemoPage } from '../Demo/DemoPage';
import { AffiliatePage } from './AffiliatePage';

export const LandingPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showAffiliate, setShowAffiliate] = useState(false);
  const [planPrices, setPlanPrices] = useState({
    essential: 16.90,
    complete: 19.90
  });

  useEffect(() => {
    // Load admin config for prices
    const storedConfig = localStorage.getItem('admin_config');
    if (storedConfig) {
      try {
        const config = JSON.parse(storedConfig);
        setPlanPrices({
          essential: config.plans.essential.price,
          complete: config.plans.complete.price
        });
      } catch (error) {
        console.error('Error loading config:', error);
      }
    }

    // Listen for config updates
    const handleConfigUpdate = (event: any) => {
      setPlanPrices({
        essential: event.detail.plans.essential.price,
        complete: event.detail.plans.complete.price
      });
    };

    window.addEventListener('adminConfigUpdated', handleConfigUpdate);
    return () => window.removeEventListener('adminConfigUpdated', handleConfigUpdate);
  }, []);

  const features = [
    {
      icon: Calendar,
      title: 'Agendamento Online',
      description: 'Seus clientes podem agendar 24/7 através do seu link personalizado'
    },
    {
      icon: DollarSign,
      title: 'Controle Financeiro',
      description: 'Gerencie receitas e despesas automaticamente'
    },
    {
      icon: Smartphone,
      title: 'WhatsApp Integrado',
      description: 'Notificações automáticas via WhatsApp para você e seus clientes'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Completos',
      description: 'Dashboard com gráficos e estatísticas em tempo real'
    },
    {
      icon: Users,
      title: 'Gestão de Clientes',
      description: 'Histórico completo de agendamentos e preferências'
    },
    {
      icon: Shield,
      title: 'Seguro e Confiável',
      description: 'Seus dados protegidos com a melhor tecnologia'
    }
  ];

  const businessTypes = [
    { icon: Scissors, name: 'Salões de Beleza', description: 'Cortes, coloração, tratamentos' },
    { icon: Scissors, name: 'Barbearias', description: 'Cortes masculinos, barba, bigode' },
    { icon: Heart, name: 'Clínicas de Estética', description: 'Procedimentos estéticos, massagens' },
    { icon: Heart, name: 'Consultórios Médicos', description: 'Consultas, exames, tratamentos' },
    { icon: Car, name: 'Oficinas Mecânicas', description: 'Manutenção, revisão, reparos' },
    { icon: Home, name: 'Serviços Domésticos', description: 'Limpeza, jardinagem, reparos' },
    { icon: Briefcase, name: 'Consultoria', description: 'Reuniões, assessoria, coaching' },
    { icon: GraduationCap, name: 'Aulas Particulares', description: 'Ensino, tutoria, cursos' }
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      business: 'Salão Beleza Pura',
      text: 'Aumentei meus agendamentos em 40% desde que comecei a usar o AGENDA.PRO. Meus clientes adoram a praticidade!',
      rating: 5
    },
    {
      name: 'João Santos',
      business: 'Barbearia do João',
      text: 'O controle financeiro automático me economiza horas por semana. Recomendo para todos os colegas!',
      rating: 5
    },
    {
      name: 'Ana Costa',
      business: 'Estética Ana',
      text: 'Sistema muito fácil de usar. Meus clientes conseguem agendar sozinhos e eu recebo tudo no WhatsApp.',
      rating: 5
    }
  ];

  const plans = [
    {
      name: 'Essencial',
      price: planPrices.essential,
      description: 'Perfeito para começar',
      features: [
        'Página de agendamento personalizada',
        'Agendamento online ilimitado',
        'Link personalizado para divulgação',
        'Notificações automáticas WhatsApp',
        'Gestão de clientes',
        'Calendário de agendamentos',
        'Suporte via WhatsApp'
      ],
      popular: false,
      buttonText: 'Começar Agora',
      limitations: 'Apenas funcionalidades de agendamento'
    },
    {
      name: 'Completo',
      price: planPrices.complete,
      description: 'Solução completa para seu negócio',
      features: [
        'Página de agendamento personalizada',
        'Agendamento online ilimitado',
        'Link personalizado para divulgação',
        'Notificações automáticas no WhatsApp',
        'Gestão de clientes',
        'Calendário de agendamentos',
        'Controle financeiro completo',
        'Lançamento de entrada e saída',
        'Relatórios e gráficos avançados',
        'Dashboard com estatísticas',
        'Histórico de transações',
        'Suporte via WhatsApp'
      ],
      popular: true,
      buttonText: 'Escolher Completo',
      limitations: null
    }
  ];

  const handlePlanSelect = (planName: string) => {
    setShowRegister(true);
  };

  if (showAffiliate) {
    return <AffiliatePage onBack={() => setShowAffiliate(false)} />;
  }

  if (showDemo) {
    return <DemoPage onBack={() => setShowDemo(false)} />;
  }

  if (showLogin) {
    return <LoginForm onBack={() => setShowLogin(false)} />;
  }

  if (showRegister) {
    return <RegisterForm onBack={() => setShowRegister(false)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AGENDA.PRO</h1>
                <p className="text-xs text-gray-600">Sistema de Agendamento e Financeiro</p>
                <p className="text-xs text-gray-500">Um produto CIC ALERTA</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAffiliate(true)}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Revendedor - Seja um Afiliado
              </button>
              <button
                onClick={() => setShowDemo(true)}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Ver Demonstração
              </button>
              <button
                onClick={() => setShowLogin(true)}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Entrar
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Cadastre-se
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Transforme seu negócio com
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> agendamentos inteligentes</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Sistema completo de agendamento online com controle financeiro integrado. 
              Seus clientes agendam sozinhos e você recebe tudo no WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowRegister(true)}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center justify-center space-x-2"
              >
                <span>Começar Gratuitamente</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowDemo(true)}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-gray-400 transition-colors font-semibold text-lg"
              >
                Ver Demonstração
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              ✅ 7 dias grátis • ✅ Cancele quando quiser • ✅ Suporte incluído
            </p>
          </div>
        </div>
      </section>

      {/* Business Types Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ideal para todos os tipos de negócio
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Seja qual for seu segmento, o AGENDA.PRO se adapta às suas necessidades
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessTypes.map((business, index) => {
              const Icon = business.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{business.name}</h3>
                  <p className="text-gray-600 text-sm">{business.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Funcionalidades pensadas especialmente para pequenos negócios que querem crescer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Como funciona?
            </h2>
            <p className="text-xl text-gray-600">
              Em 3 passos simples você já está recebendo agendamentos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cadastre-se</h3>
              <p className="text-gray-600">
                Crie sua conta em 4 etapas simples e configure seus serviços
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Compartilhe seu link</h3>
              <p className="text-gray-600">
                Divulgue seu link personalizado nas redes sociais e WhatsApp
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Receba agendamentos</h3>
              <p className="text-gray-600">
                Seus clientes agendam sozinhos e você recebe tudo no WhatsApp
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planos que cabem no seu bolso
            </h2>
            <p className="text-xl text-gray-600">
              Escolha o plano ideal para o seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg border-2 ${
                plan.popular ? 'border-blue-500 relative' : 'border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Mais Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">R$ {plan.price.toFixed(2)}</span>
                    <span className="text-gray-600 ml-2">/mês</span>
                  </div>
                  {plan.limitations && (
                    <p className="text-sm text-orange-600 mt-2 font-medium">{plan.limitations}</p>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelect(plan.name)}
                  className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">🎉 Oferta Especial de Lançamento!</h3>
              <p className="text-yellow-700">
                <strong>7 dias grátis</strong> para testar todas as funcionalidades. 
                Depois disso, pague apenas o plano escolhido. Cancele quando quiser, sem multas!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-gray-600">
              Mais de 1.000 negócios já confiam no AGENDA.PRO
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.business}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a milhares de empreendedores que já aumentaram suas vendas com o AGENDA.PRO
          </p>
          <button
            onClick={() => setShowRegister(true)}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg inline-flex items-center space-x-2"
          >
            <span>Começar Agora - 7 Dias Grátis</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-blue-100 text-sm mt-4">
            Sem compromisso • Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">AGENDA.PRO</span>
                <p className="text-xs text-gray-400">Um produto CIC ALERTA</p>
              </div>
            </div>
            <p className="text-gray-400 mb-8">
              Sistema de Agendamento e Financeiro para pequenos negócios
            </p>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AGENDA.PRO - Um produto CIC ALERTA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/5541996772512?text=Olá! Gostaria de saber mais sobre o AGENDA.PRO e como ele pode ajudar meu negócio."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
};