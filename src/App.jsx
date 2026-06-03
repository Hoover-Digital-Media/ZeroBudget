import { useState } from 'react';
import { BudgetProvider } from './context/BudgetContext';
import MonthNav from './components/MonthNav/MonthNav';
import IncomeSection from './components/IncomeSection/IncomeSection';
import LeftToAssign from './components/LeftToAssign/LeftToAssign';
import CategoryCard from './components/CategoryCard/CategoryCard';
import TransactionForm from './components/TransactionForm/TransactionForm';
import { useBudgetContext } from './context/BudgetContext';
import './App.css';

function AppContent() {
  const { categories, addCategory } = useBudgetContext();
  const [newCatName, setNewCatName] = useState('');

  function handleAddCategory(e) {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim());
    setNewCatName('');
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <h1 className="app-title">ZeroBudget</h1>
          <p className="app-subtitle">Give every dollar a job.</p>
        </div>
        <ol className="app-steps">
          <li><span className="step-num">1</span> Add your income</li>
          <li className="step-arrow">→</li>
          <li><span className="step-num">2</span> Set category budgets</li>
          <li className="step-arrow">→</li>
          <li><span className="step-num">3</span> Log transactions as you spend</li>
        </ol>
      </header>

      <main className="app-main">
        <MonthNav />

        <div className="app-top">
          <IncomeSection />
          <LeftToAssign />
        </div>

        <section className="categories-section">
          <div className="categories-header">
            <div>
              <h2>Budget Categories</h2>
              <p className="section-hint">Set a spending limit for each category. Click any budgeted amount to edit it. Use the quick-add on each card to log a purchase, or use the form below.</p>
            </div>
            <form className="add-category-form" onSubmit={handleAddCategory}>
              <input
                type="text"
                placeholder="New category name"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                aria-label="New category name"
              />
              <button type="submit" className="btn-secondary">Add Category</button>
            </form>
          </div>
          <div className="categories-grid">
            {categories.map(cat => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        <TransactionForm />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BudgetProvider>
      <AppContent />
    </BudgetProvider>
  );
}
