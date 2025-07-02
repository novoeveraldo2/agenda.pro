import React, { useState } from 'react';
import { Building, Phone, Mail, Clock, CreditCard, MapPin, FileText, Camera, Link, Copy, Upload, Palette } from 'lucide-react';
import { useTenantProfile } from '../../hooks/useTenantProfile';
import { useAuth } from '../../contexts/AuthContext';

export const ProfileSettings: React.FC = () => {
  const { profile, updateProfile } = useTenantProfile();
  const { tenant } = useAuth();
  const [formData, setFormData] = useState({
    businessName: profile?.businessName || '',
    description: profile?.description || '',
    address: profile?.address || '',
    phone: profile?.phone || '',
    email: profile?.email || '',
    logo: profile?.logo || '',
    primaryColor: profile?.primaryColor || '#2563eb',
    workingHours: {
      start: profile?.workingHours?.start || '08:00',
      end: profile?.workingHours?.end || '18:00',
      days: profile?.workingHours?.days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    paymentMethods: {
      pix: profile?.paymentMethods?.pix || false,
      card: profile?.paymentMethods?.card || false,
      cash: profile?.paymentMethods?.cash || false,
      pixKey: profile?.paymentMethods?.pixKey || ''
    }
  });

  const [copied, setCopied] = useState(false);

  // Create URL-friendly business name
  const urlFriendlyName = formData.businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const publicLink = `${window.location.origin}/booking/${tenant?.id}/${urlFriendlyName || 'agendamento'}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    alert('Perfil atualizado com sucesso!');
  };

  const handleDayToggle = (day: string) => {
    const updatedDays = formData.workingHours.days.includes(day)
      ? formData.workingHours.days.filter(d => d !== day)
      : [...formData.workingHours.days, day];
    
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        days: updatedDays
      }
    }));
  };

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const dayLabels = {
    monday: 'Segunda',
    tuesday: 'Terça',
    wednesday: 'Quarta',
    thursday: 'Quinta',
    friday: 'Sexta',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  const colorPresets = [
    '#2563eb', '#dc2626', '#059669', '#7c3aed', '#ea580c', '#0891b2', '#be185d', '#4338ca'
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Configurações do Perfil</h1>
        <p className="text-gray-600">Configure as informações do seu negócio e personalize sua página de agendamento</p>
      </div>

      {/* Link Público */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-3">
          <Link className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">Link Público para Agendamentos</h3>
        </div>
        <p className="text-blue-700 mb-4">Compartilhe este link com seus clientes para que eles possam agendar diretamente:</p>
        <div className="flex items-center space-x-3 mb-4">
          <input
            type="text"
            value={publicLink}
            readOnly
            className="flex-1 px-4 py-2 bg-white border border-blue-300 rounded-lg text-blue-800 font-mono text-sm"
          />
          <button
            onClick={copyPublicLink}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>
        
        <p className="text-xs text-blue-600 mt-2">
          O link será atualizado automaticamente quando você alterar o nome do negócio
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
        {/* Informações Básicas */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Nome do Negócio
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome da sua empresa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Telefone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contato@empresa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Endereço
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Rua, número, bairro, cidade"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Descrição do Negócio
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descreva seu negócio, especialidades, diferenciais..."
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Camera className="w-4 h-4 inline mr-1" />
              Logo do Negócio
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">Escolher arquivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {formData.logo && (
                <div className="w-20 h-20 border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={formData.logo}
                    alt="Logo preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Personalização Visual */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            <Palette className="w-5 h-5 inline mr-2" />
            Personalização da Página de Agendamento
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Cor Principal</label>
            <div className="flex items-center space-x-4 mb-4">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={formData.primaryColor}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                placeholder="#2563eb"
              />
            </div>
            
            <div className="grid grid-cols-8 gap-2">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, primaryColor: color }))}
                  className={`w-8 h-8 rounded-lg border-2 ${
                    formData.primaryColor === color ? 'border-gray-400' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Preview da Cor</h4>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="px-4 py-2 rounded-lg text-white font-medium"
                style={{ backgroundColor: formData.primaryColor }}
              >
                Botão Principal
              </button>
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: formData.primaryColor }}
              />
              <span className="text-sm text-gray-600">Esta cor será aplicada em botões e elementos principais</span>
            </div>
          </div>
        </div>

        {/* Horário de Funcionamento */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            <Clock className="w-5 h-5 inline mr-2" />
            Horário de Funcionamento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Abertura</label>
              <input
                type="time"
                value={formData.workingHours.start}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  workingHours: { ...prev.workingHours, start: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fechamento</label>
              <input
                type="time"
                value={formData.workingHours.end}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  workingHours: { ...prev.workingHours, end: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Dias de Funcionamento</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(dayLabels).map(([day, label]) => (
                <label key={day} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.workingHours.days.includes(day)}
                    onChange={() => handleDayToggle(day)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Formas de Pagamento */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            <CreditCard className="w-5 h-5 inline mr-2" />
            Formas de Pagamento
          </h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.paymentMethods.pix}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  paymentMethods: { ...prev.paymentMethods, pix: e.target.checked }
                }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">PIX</span>
            </label>

            {formData.paymentMethods.pix && (
              <div className="ml-7">
                <input
                  type="text"
                  value={formData.paymentMethods.pixKey}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    paymentMethods: { ...prev.paymentMethods, pixKey: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Chave PIX (CPF, email, telefone ou chave aleatória)"
                />
              </div>
            )}

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.paymentMethods.card}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  paymentMethods: { ...prev.paymentMethods, card: e.target.checked }
                }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Cartão de Crédito/Débito</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.paymentMethods.cash}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  paymentMethods: { ...prev.paymentMethods, cash: e.target.checked }
                }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Dinheiro</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Salvar Configurações
        </button>
      </form>
    </div>
  );
};