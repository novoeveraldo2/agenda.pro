import React, { useState } from 'react';
import { Plus, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { TransactionForm } from './TransactionForm';
import { TransactionsList } from './TransactionsList';
import { formatCurrency } from '../../utils/dateUtils';

export const FinanceManager: React.FC = () => {
  const { transactions, getBalance, getMonthlyIncome, getWeeklyIncome } = useTransactions();
  const [showForm, setShowForm] = useState(false);

  const balance = getBalance();
  const monthlyIncome = getMonthlyIncome();
  const weeklyIncome = getWeeklyIncome();
  
  const monthlyExpenses = transactions
    .filter(t => {
      const date = new Date(t.date);
      const now = new Date();
      return t.type === 'expense' && 
             date.getMonth() === now.getMonth() && 
             date.getFullYear() === now.getFullYear();
    })
    .reduce((acc, t) => acc + t.amount, 0);

  const stats = [
    {
      title: 'Saldo Total',
      value: formatCurrency(balance),
      icon: DollarSign,
      color: balance >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: balance >= 0 ? 'bg-green-100' : 'bg-red-100'
    },
    {
      title: 'Receita Mensal',
      value: formatCurrency(monthlyIncome),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Despesas Mensais',
      value: formatCurrency(monthlyExpenses),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestão Financeira</h1>
          <p className="text-gray-600">Controle suas receitas e despesas</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Transação</span>
        </button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Formulário de nova transação */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Nova Transação</h2>
          <TransactionForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      {/* Lista de transações */}
      <TransactionsList />
    </div>
  );
};