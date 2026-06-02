import './TransactionList.css';

function fmt(n) {
  return Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export default function TransactionList({ transactions, onDelete }) {
  return (
    <ul className="transaction-list">
      {transactions.map(tx => (
        <li key={tx.id} className="transaction-row">
          <span className="tx-date">{tx.date}</span>
          <span className="tx-desc">{tx.description}</span>
          <span className="tx-amount">{fmt(tx.amount)}</span>
          <button className="btn-icon btn-icon--danger" onClick={() => onDelete(tx.id)} aria-label="Delete transaction">&#10005;</button>
        </li>
      ))}
    </ul>
  );
}
