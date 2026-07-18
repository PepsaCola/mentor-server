import { useState } from 'react';

import { formatCurrency } from '../utils/formatCurrency.js';
import { formatDate, toInputDate } from '../utils/formatDate.js';

const TransactionRow = ({ transaction, categories, onDelete, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const startEdit = () => {
    setForm({
      amount: transaction.amount,
      type: transaction.type,
      date: toInputDate(transaction.date),
      note: transaction.note ?? '',
      categoryId: transaction.categoryId ?? '',
    });
    setError('');
    setIsEditing(true);
  };

  const cancelEdit = () => setIsEditing(false);

  const handleSave = async () => {
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    setIsSaving(true);
    try {
      await onSave(transaction.id, { ...form, amount: Number(form.amount), categoryId: form.categoryId || null });
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing) {
    return (
      <tr>
        <td>{formatDate(transaction.date)}</td>
        <td>{transaction.category?.name ?? 'Uncategorized'}</td>
        <td>{transaction.note ?? '—'}</td>
        <td className={`amount ${transaction.type === 'INCOME' ? 'income' : 'expense'}`}>
          {transaction.type === 'INCOME' ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </td>
        <td>
          <button className="btn secondary" onClick={startEdit}>
            Edit
          </button>{' '}
          <button className="btn secondary" onClick={() => onDelete(transaction.id)}>
            Delete
          </button>
        </td>
      </tr>
    );
  }

  const filteredCategories = categories.filter((c) => c.type === form.type);

  return (
    <tr>
      <td>
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
      </td>
      <td>
        <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
          <option value="">Uncategorized</option>
          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </td>
      <td>
        <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
      </td>
      <td>
        <div style={{ display: 'flex', gap: 6 }}>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, categoryId: '' })}>
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
          <input
            type="number"
            step="0.01"
            min="0"
            style={{ width: 90 }}
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>
        {error && <p className="error-text">{error}</p>}
      </td>
      <td>
        <button className="btn" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </button>{' '}
        <button className="btn secondary" onClick={cancelEdit} disabled={isSaving}>
          Cancel
        </button>
      </td>
    </tr>
  );
};

const TransactionTable = ({ transactions, categories, onDelete, onUpdate }) => {
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
            <TransactionRow
              key={t.id}
              transaction={t}
              categories={categories}
              onDelete={onDelete}
              onSave={onUpdate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
