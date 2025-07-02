import React, { useState } from 'react';
import { DollarSign, Calendar, FileText, Tag } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';

interface TransactionFormProps {
  onSuccess: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess }) => {
  const { addTransaction } = useTransactions();
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = {
    income: [
      'Serviços',
      'Produtos',
      'Comissões',
      'Outros'
    ],
    expense: [
      'Aluguel',
      'Materiais',
      'Marketing',
      'Equipamentos',
      'Manutenção',
      'Outros'
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addTransaction({
      type: formData.type,
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date
    });

    // Reset form
    setFormData({
      type: 'income',
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });

    onSuccess();
  };

  const isFormValid = formData.description && formData.amount && formData.category && formData.date;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tipo de transação */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Transação</label>
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
              formData.type === 'income'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: '' }))}
          >
            <div className="text-2xl mb-2">💰</div>
            <div className="font-medium text-gray-900">Entrada</div>
          </div>
          <div
            className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
              formData.type === 'expense'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
          >
            <div className="text-2xl mb-2">💸</div>
            <div className="font-medium text-gray-900">Saída</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-1" />
            Descrição
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Descreva a transação"
            required
          />
        </div>

        {/* Valor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Valor (R$)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0,00"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4 inline mr-1" />
            Categoria
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories[formData.type].map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Data */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Data
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={!isFormValid}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Adicionar Transação
        </button>
        <button
          type="button"
          onClick={() => {
            setFormData({
              type: 'income',
              description: '',
              amount: '',
              category: '',
              date: new Date().toISOString().split('T')[0]
            });
          }}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Limpar
        </button>
      </div>
    </form>
  );
};