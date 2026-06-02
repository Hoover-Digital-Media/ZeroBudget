import { useState } from 'react';
import { useBudgetContext } from '../../context/BudgetContext';
import TransactionList from '../TransactionList/TransactionList';
import './CategoryCard.css';

function fmt(n) {
  return Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export default function CategoryCard({ category }) {
  const { spentByCategory, addTransaction, deleteTransaction, transactions, updateCategory, deleteCategory } = useBudgetContext();
  const [editingName, setEditingName] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);
  const [nameVal, setNameVal] = useState(category.name);
  const [budgetVal, setBudgetVal] = useState(category.budgeted);
  const [quickAmt, setQuickAmt] = useState('');
  const [quickDesc, setQuickDesc] = useState('');
  const [showTxns, setShowTxns] = useState(false);

  const spent = spentByCategory[category.id] || 0;
  const budgeted = Number(category.budgeted || 0);
  const remaining = budgeted - spent;
  const pct = budgeted > 0 ? Math.min((spent / budgeted) * 100, 100) : 0;
  const barClass = pct >= 100 ? 'bar--over' : pct >= 75 ? 'bar--warning' : 'bar--ok';

  const catTransactions = transactions.filter(t => t.categoryId === category.id);

  function saveName() {
    updateCategory(category.id, { name: nameVal.trim() || category.name });
    setEditingName(false);
  }

  function saveBudget() {
    updateCategory(category.id, { budgeted: parseFloat(budgetVal) || 0 });
    setEditingBudget(false);
  }

  function handleQuickAdd(e) {
    e.preventDefault();
    if (!quickAmt) return;
    addTransaction({
      categoryId: category.id,
      amount: parseFloat(quickAmt),
      description: quickDesc.trim() || category.name,
    });
    setQuickAmt('');
    setQuickDesc('');
  }

  return (
    <div className="category-card card">
      <div className="category-card__header">
        {editingName ? (
          <span className="category-card__name-edit">
            <input value={nameVal} onChange={e => setNameVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveName()} autoFocus />
            <button onClick={saveName} className="btn-icon">&#10003;</button>
            <button onClick={() => { setEditingName(false); setNameVal(category.name); }} className="btn-icon">&#10005;</button>
          </span>
        ) : (
          <h3 onClick={() => setEditingName(true)} title="Click to rename">{category.name}</h3>
        )}
        <button onClick={() => { if (confirm(`Delete "${category.name}" and all its transactions?`)) deleteCategory(category.id); }} className="btn-icon btn-icon--danger" aria-label="Delete category">&#10005;</button>
      </div>

      <div className="category-card__amounts">
        <div className="category-card__stat">
          <span className="stat-label">Budgeted</span>
          {editingBudget ? (
            <span className="stat-edit">
              <input type="number" value={budgetVal} onChange={e => setBudgetVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveBudget()} min="0" step="1" autoFocus />
              <button onClick={saveBudget} className="btn-icon">&#10003;</button>
              <button onClick={() => { setEditingBudget(false); setBudgetVal(category.budgeted); }} className="btn-icon">&#10005;</button>
            </span>
          ) : (
            <span className="stat-value clickable" onClick={() => setEditingBudget(true)} title="Click to edit">{fmt(budgeted)}</span>
          )}
        </div>
        <div className="category-card__stat">
          <span className="stat-label">Spent</span>
          <span className="stat-value">{fmt(spent)}</span>
        </div>
        <div className="category-card__stat">
          <span className="stat-label">Remaining</span>
          <span className={`stat-value ${remaining < 0 ? 'text-danger' : ''}`}>{fmt(remaining)}</span>
        </div>
      </div>

      <div className="progress-bar">
        <div className={`progress-bar__fill ${barClass}`} style={{ width: `${pct}%` }} />
      </div>

      <form className="quick-add" onSubmit={handleQuickAdd}>
        <input
          type="number"
          placeholder="Amount"
          value={quickAmt}
          onChange={e => setQuickAmt(e.target.value)}
          min="0"
          step="0.01"
          aria-label="Quick add amount"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={quickDesc}
          onChange={e => setQuickDesc(e.target.value)}
          aria-label="Quick add description"
        />
        <button type="submit" className="btn-primary btn-sm">+ Add</button>
      </form>

      {catTransactions.length > 0 && (
        <button className="btn-link" onClick={() => setShowTxns(v => !v)}>
          {showTxns ? 'Hide' : 'Show'} {catTransactions.length} transaction{catTransactions.length !== 1 ? 's' : ''}
        </button>
      )}

      {showTxns && (
        <TransactionList transactions={catTransactions} onDelete={deleteTransaction} />
      )}
    </div>
  );
}
