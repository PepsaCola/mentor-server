import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate } from '../utils/formatDate.js';

const TransactionTable = ({ transactions, onDelete }) => {
  if (transactions.length === 0) {
    return <p className="muted">No transactions yet.</p>;
  }

  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Note</th>
            <th>Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{formatDate(t.date)}</td>
              <td>{t.category?.name ?? 'Uncategorized'}</td>
              <td>{t.note ?? '—'}</td>
              <td className={`amount ${t.type === 'INCOME' ? 'income' : 'expense'}`}>
                {t.type === 'INCOME' ? '+' : '-'}
                {formatCurrency(t.amount)}
              </td>
              <td>
                <button className="btn secondary" onClick={() => onDelete(t.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
