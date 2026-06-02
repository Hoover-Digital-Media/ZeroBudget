import { createContext, useContext } from 'react';
import { useBudget } from '../hooks/useBudget';

const BudgetContext = createContext(null);

export function BudgetProvider({ children }) {
  const budget = useBudget();
  return <BudgetContext.Provider value={budget}>{children}</BudgetContext.Provider>;
}

export function useBudgetContext() {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudgetContext must be used inside BudgetProvider');
  return ctx;
}
