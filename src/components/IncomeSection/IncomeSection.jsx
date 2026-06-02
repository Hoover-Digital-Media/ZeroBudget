import { useState } from 'react';
import { useBudgetContext } from '../../context/BudgetContext';
import './IncomeSection.css';

function fmt(n) {
  return Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export default function IncomeSection() {
  const { incomeSources, totalIncome, addIncome, updateIncome, deleteIncome } = useBudgetContext();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  function handleAdd(e) {
    e.preventDefault();
    if (!name.trim() || !amount) return;
    addIncome({ name: name.trim(), amount: parseFloat(amount) });
    setName('');
    setAmount('');
  }

  return (
    <section className="income-section card">
      <h2>Income</h2>

      <ul className="income-list">
        {incomeSources.map(src => (
          <IncomeRow key={src.id} source={src} onUpdate={updateIncome} onDelete={deleteIncome} />
        ))}
        {incomeSources.length === 0 && (
          <li className="income-list__empty">No income sources yet.</li>
        )}
      </ul>

      <form className="income-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Source name"
          value={name}
          onChange={e => setName(e.target.value)}
          aria-label="Income source name"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min="0"
          step="0.01"
          aria-label="Income amount"
        />
        <button type="submit" className="btn-primary">Add</button>
      </form>

      <div className="income-total">
        Total income: <strong>{fmt(totalIncome)}</strong>
      </div>
    </section>
  );
}

function IncomeRow({ source, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(source.name);
  const [amount, setAmount] = useState(source.amount);

  function save() {
    onUpdate(source.id, { name: name.trim() || source.name, amount: parseFloat(amount) || 0 });
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="income-row income-row--editing">
        <input value={name} onChange={e => setName(e.target.value)} aria-label="Edit name" />
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} min="0" step="0.01" aria-label="Edit amount" />
        <button onClick={save} className="btn-primary btn-sm">Save</button>
        <button onClick={() => setEditing(false)} className="btn-secondary btn-sm">Cancel</button>
      </li>
    );
  }

  return (
    <li className="income-row">
      <span className="income-row__name">{source.name}</span>
      <span className="income-row__amount">{Number(source.amount || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
      <button onClick={() => setEditing(true)} className="btn-icon" aria-label="Edit">&#9998;</button>
      <button onClick={() => onDelete(source.id)} className="btn-icon btn-icon--danger" aria-label="Delete">&#10005;</button>
    </li>
  );
}
