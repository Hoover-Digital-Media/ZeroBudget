import { useBudgetContext } from '../../context/BudgetContext';
import './MonthNav.css';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

export default function MonthNav() {
  const { currentYear, currentMonth, goToPrevMonth, goToNextMonth, copyFromLastMonth, resetMonth } = useBudgetContext();

  return (
    <div className="month-nav">
      <div className="month-nav__controls">
        <button onClick={goToPrevMonth} aria-label="Previous month">&#8592;</button>
        <span className="month-nav__label">{MONTHS[currentMonth]} {currentYear}</span>
        <button onClick={goToNextMonth} aria-label="Next month">&#8594;</button>
      </div>
      <div className="month-nav__actions">
        <button className="btn-secondary" onClick={copyFromLastMonth}>Copy from last month</button>
        <button className="btn-danger" onClick={() => { if (confirm('Reset this month? All data will be cleared.')) resetMonth(); }}>
          Reset month
        </button>
      </div>
    </div>
  );
}
