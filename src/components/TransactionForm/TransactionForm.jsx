import { useState } from 'react';
import { useBudgetContext } from '../../context/BudgetContext';
import './TransactionForm.css';

export default function TransactionForm() {
  const { categories, addTransaction } = useBudgetContext();
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  function handleSubmit(e) {
    e.preventDefault();
    if (!categoryId || !amount) return;
    addTransaction({ categoryId, amount: parseFloat(amount), description: description.trim(), date });
    setAmount('');
    setDescription('');
  }

  return (
    <section className="transaction-form card">
      <h2>Add Transaction</h2>
      <p className="section-hint">Record a purchase or payment. Choose the category it belongs to, enter the amount, and add an optional description so you remember what it was.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="tx-category">Category</label>
            <select id="tx-category" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
              <option value="">Select…</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="tx-amount">Amount</label>
            <input id="tx-amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} min="0" step="0.01" required placeholder="0.00" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field form-field--grow">
            <label htmlFor="tx-desc">Description</label>
            <input id="tx-desc" type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="What was this for?" />
          </div>
          <div className="form-field">
            <label htmlFor="tx-date">Date</label>
            <input id="tx-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>
        <button type="submit" className="btn-primary">Add Transaction</button>
      </form>
    </section>
  );
}
