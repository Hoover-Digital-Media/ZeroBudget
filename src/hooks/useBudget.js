import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_CATEGORIES } from '../data/defaults';

function monthKey(year, month) {
  return `zb-${year}-${String(month + 1).padStart(2, '0')}`;
}

function emptyMonth() {
  return {
    incomeSources: [],
    categories: DEFAULT_CATEGORIES.map(c => ({ ...c })),
    transactions: [],
  };
}

export function useBudget() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useLocalStorage('zb-current-year', today.getFullYear());
  const [currentMonth, setCurrentMonth] = useLocalStorage('zb-current-month', today.getMonth());

  const key = monthKey(currentYear, currentMonth);
  const [monthData, setMonthData] = useLocalStorage(key, emptyMonth());

  const { incomeSources, categories, transactions } = monthData;

  // ── Derived totals ─────────────────────────────────────────────────────────
  const totalIncome = useMemo(
    () => incomeSources.reduce((sum, s) => sum + Number(s.amount || 0), 0),
    [incomeSources]
  );

  const totalBudgeted = useMemo(
    () => categories.reduce((sum, c) => sum + Number(c.budgeted || 0), 0),
    [categories]
  );

  const leftToAssign = totalIncome - totalBudgeted;

  const spentByCategory = useMemo(() => {
    const map = {};
    for (const t of transactions) {
      map[t.categoryId] = (map[t.categoryId] || 0) + Number(t.amount || 0);
    }
    return map;
  }, [transactions]);

  // ── Month navigation ────────────────────────────────────────────────────────
  const goToPrevMonth = useCallback(() => {
    setCurrentMonth(m => {
      if (m === 0) { setCurrentYear(y => y - 1); return 11; }
      return m - 1;
    });
  }, [setCurrentMonth, setCurrentYear]);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(m => {
      if (m === 11) { setCurrentYear(y => y + 1); return 0; }
      return m + 1;
    });
  }, [setCurrentMonth, setCurrentYear]);

  const copyFromLastMonth = useCallback(() => {
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear  = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevKey   = monthKey(prevYear, prevMonth);
    try {
      const prev = JSON.parse(localStorage.getItem(prevKey));
      if (!prev) return;
      setMonthData(d => ({
        ...d,
        categories: prev.categories.map(c => ({ ...c })),
      }));
    } catch { /* nothing stored yet */ }
  }, [currentMonth, currentYear, setMonthData]);

  const resetMonth = useCallback(() => {
    setMonthData(emptyMonth());
  }, [setMonthData]);

  // ── Income ──────────────────────────────────────────────────────────────────
  const addIncome = useCallback((source) => {
    setMonthData(d => ({
      ...d,
      incomeSources: [...d.incomeSources, { ...source, id: crypto.randomUUID() }],
    }));
  }, [setMonthData]);

  const updateIncome = useCallback((id, updates) => {
    setMonthData(d => ({
      ...d,
      incomeSources: d.incomeSources.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  }, [setMonthData]);

  const deleteIncome = useCallback((id) => {
    setMonthData(d => ({
      ...d,
      incomeSources: d.incomeSources.filter(s => s.id !== id),
    }));
  }, [setMonthData]);

  // ── Categories ──────────────────────────────────────────────────────────────
  const updateCategory = useCallback((id, updates) => {
    setMonthData(d => ({
      ...d,
      categories: d.categories.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  }, [setMonthData]);

  const addCategory = useCallback((name) => {
    setMonthData(d => ({
      ...d,
      categories: [...d.categories, { id: crypto.randomUUID(), name, budgeted: 0 }],
    }));
  }, [setMonthData]);

  const deleteCategory = useCallback((id) => {
    setMonthData(d => ({
      ...d,
      categories: d.categories.filter(c => c.id !== id),
      transactions: d.transactions.filter(t => t.categoryId !== id),
    }));
  }, [setMonthData]);

  // ── Transactions ────────────────────────────────────────────────────────────
  const addTransaction = useCallback((tx) => {
    setMonthData(d => ({
      ...d,
      transactions: [...d.transactions, { ...tx, id: crypto.randomUUID(), date: tx.date || new Date().toISOString().slice(0, 10) }],
    }));
  }, [setMonthData]);

  const deleteTransaction = useCallback((id) => {
    setMonthData(d => ({
      ...d,
      transactions: d.transactions.filter(t => t.id !== id),
    }));
  }, [setMonthData]);

  return {
    // State
    currentYear,
    currentMonth,
    incomeSources,
    categories,
    transactions,
    // Derived
    totalIncome,
    totalBudgeted,
    leftToAssign,
    spentByCategory,
    // Month actions
    goToPrevMonth,
    goToNextMonth,
    copyFromLastMonth,
    resetMonth,
    // Income actions
    addIncome,
    updateIncome,
    deleteIncome,
    // Category actions
    updateCategory,
    addCategory,
    deleteCategory,
    // Transaction actions
    addTransaction,
    deleteTransaction,
  };
}
