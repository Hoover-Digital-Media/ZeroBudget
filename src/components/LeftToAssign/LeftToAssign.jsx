import { useBudgetContext } from '../../context/BudgetContext';
import './LeftToAssign.css';

function fmt(n) {
  return Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export default function LeftToAssign() {
  const { leftToAssign } = useBudgetContext();
  const isNegative = leftToAssign < 0;
  const isZero = leftToAssign === 0;

  return (
    <div className={`left-to-assign ${isNegative ? 'left-to-assign--over' : isZero ? 'left-to-assign--zero' : ''}`}>
      <span className="lta-label">Left to Assign</span>
      <span className="lta-amount">{fmt(leftToAssign)}</span>
      {isNegative && <span className="lta-warning">You've over-budgeted!</span>}
      {isZero && <span className="lta-success">Every dollar is assigned.</span>}
    </div>
  );
}
