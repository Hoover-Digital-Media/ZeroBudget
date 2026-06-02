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
      </header>

      <main className="app-main">
        <MonthNav />

        <div className="app-top">
          <IncomeSection />
          <LeftToAssign />
        </div>

        <section className="categories-section">
          <div className="categories-header">
            <h2>Budget Categories</h2>
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
