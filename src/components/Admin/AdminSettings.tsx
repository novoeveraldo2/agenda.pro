import React, { useState, useEffect } from 'react';
import { Save, DollarSign, Users, Percent } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AdminConfig {
  chave_pix: string;
  planos: {
    essential: {
      name: string;
      price: number;
    };
    complete: {
      name: string;
      price: number;
    };
  };
  affiliate: {
    commission: number;
    minSales: number;
  };
}

export const AdminSettings: React.FC = () => {
  const [config, setConfig] = useState<AdminConfig>({
    chave_pix: 'novoeveraldo5@gmail.com',
    planos: {
      essential: {
        name: 'Essencial',
        price: 16.90
      },
      complete: {
        name: 'Completo',
        price: 19.90
      }
    },
    affiliate: {
      commission: 30,
      minSales: 5
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes_admin')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setConfig({
          chave_pix: data.chave_pix,
          planos: data.planos,
          affiliate: data.affiliate
        });
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('configuracoes_admin')
        .upsert({
          id: '1', // Use a fixed ID for singleton config
          chave_pix: config.chave_pix,
          planos: config.planos,
          affiliate: config.affiliate
        });

      if (error) {
        throw error;
      }

      alert('Configurações salvas com sucesso!');
    } catch (error: any) {
      alert('Erro ao salvar configurações: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Configurações do Administrador</h1>
        <p className="text-gray-600">Configure as informações globais do sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PIX Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Configuração PIX</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chave PIX para Recebimentos
            </label>
            <input
              type="text"
              value={config.chave_pix}
              onChange={(e) => setConfig(prev => ({ ...prev, chave_pix: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite sua chave PIX"
            />
            <p className="text-xs text-gray-500 mt-1">
              Esta chave será exibida para os comerciantes realizarem pagamentos
            </p>
          </div>
        </div>

        {/* Plans Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Preços dos Planos</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plano Essencial (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={config.planos.essential.price}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  planos: {
                    ...prev.planos,
                    essential: {
                      ...prev.planos.essential,
                      price: parseFloat(e.target.value) || 0
                    }
                  }
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plano Completo (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={config.planos.complete.price}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  planos: {
                    ...prev.planos,
                    complete: {
                      ...prev.planos.complete,
                      price: parseFloat(e.target.value) || 0
                    }
                  }
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Affiliate Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Percent className="w-6 h-6 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Configuração de Afiliados</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comissão por Venda (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={config.affiliate.commission}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  affiliate: {
                    ...prev.affiliate,
                    commission: parseInt(e.target.value) || 0
                  }
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mínimo de Vendas para Receber
              </label>
              <input
                type="number"
                min="1"
                value={config.affiliate.minSales}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  affiliate: {
                    ...prev.affiliate,
                    minSales: parseInt(e.target.value) || 1
                  }
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview das Configurações</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Chave PIX:</span>
              <span className="font-medium">{config.chave_pix}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Plano Essencial:</span>
              <span className="font-medium">R$ {config.planos.essential.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Plano Completo:</span>
              <span className="font-medium">R$ {config.planos.complete.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Comissão Afiliado:</span>
              <span className="font-medium">{config.affiliate.commission}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Comissão por venda Essencial:</span>
              <span className="font-medium text-green-600">
                R$ {(config.planos.essential.price * config.affiliate.commission / 100).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Comissão por venda Completo:</span>
              <span className="font-medium text-green-600">
                R$ {(config.planos.complete.price * config.affiliate.commission / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Salvando...' : 'Salvar Configurações'}</span>
        </button>
      </div>
    </div>
  );
};