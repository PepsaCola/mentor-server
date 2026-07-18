import { formatCurrency } from '../utils/formatCurrency.js';

const BudgetProgressList = ({ progress }) => {
  if (!progress || progress.length === 0) {
    return <p className="muted">No budgets set yet. Go to Budgets to add some.</p>;
  }

  return (
    <div className="budget-list">
      {progress.map((item) => {
        const pct = item.amount > 0 ? Math.min((item.spent / item.amount) * 100, 100) : 0;
        const isOver = item.spent > item.amount;
        return (
          <div key={item.id} className="budget-row">
            <div className="budget-row-header">
              <span>{item.categoryName}</span>
              <span className={isOver ? 'error-text' : 'muted'}>
                {formatCurrency(item.spent)} / {formatCurrency(item.amount)}
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${pct}%`, background: isOver ? 'var(--color-expense)' : item.color || 'var(--color-primary)' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetProgressList;
