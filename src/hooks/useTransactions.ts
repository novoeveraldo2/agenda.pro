import { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useTransactions = () => {
  const { tenant } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions when tenant changes
  useEffect(() => {
    if (tenant) {
      const stored = localStorage.getItem(`transactions_${tenant.id}`);
      if (stored) {
        try {
          const parsedTransactions = JSON.parse(stored);
          setTransactions(parsedTransactions);
          console.log(`Loaded ${parsedTransactions.length} transactions for tenant ${tenant.id}`);
        } catch (error) {
          console.error('Error parsing transactions from localStorage:', error);
          setTransactions([]);
        }
      } else {
        setTransactions([]);
      }
    }
  }, [tenant]);

  const saveTransactions = (newTransactions: Transaction[]) => {
    if (tenant) {
      try {
        setTransactions(newTransactions);
        localStorage.setItem(`transactions_${tenant.id}`, JSON.stringify(newTransactions));
        console.log(`Saved ${newTransactions.length} transactions for tenant ${tenant.id}`);
      } catch (error) {
        console.error('Error saving transactions to localStorage:', error);
      }
    }
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'tenantId'>) => {
    if (!tenant) {
      console.error('No tenant found, cannot add transaction');
      return null;
    }

    const newTransaction: Transaction = {
      ...transaction,
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId: tenant.id
    };
    
    const updated = [...transactions, newTransaction];
    saveTransactions(updated);
    console.log('New transaction added:', newTransaction);
    return newTransaction;
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    saveTransactions(updated);
    console.log(`Deleted transaction ${id}`);
  };

  const getBalance = () => {
    return transactions.reduce((acc, transaction) => {
      return transaction.type === 'income' 
        ? acc + transaction.amount 
        : acc - transaction.amount;
    }, 0);
  };

  const getMonthlyIncome = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return t.type === 'income' && 
               transactionDate.getMonth() === currentMonth &&
               transactionDate.getFullYear() === currentYear;
      })
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const getWeeklyIncome = () => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return t.type === 'income' && transactionDate >= weekStart;
      })
      .reduce((acc, t) => acc + t.amount, 0);
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    getBalance,
    getMonthlyIncome,
    getWeeklyIncome
  };
};