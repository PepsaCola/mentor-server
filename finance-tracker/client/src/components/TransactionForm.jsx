import { useState } from 'react';

import { toInputDate } from '../utils/formatDate.js';

const emptyForm = { amount: '', type: 'EXPENSE', date: toInputDate(new Date()), note: '', categoryId: '' };

const TransactionForm = ({ categories, onCreate }) => {
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const filteredCategories = categories.filter((c) => c.type === form.type);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await onCreate({ ...form, amount: Number(form.amount), categoryId: form.categoryId || null });
      setForm(emptyForm);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <div className="form-row">
        <div className="field">
          <label>Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value, categoryId: '' })}
          >
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </div>
        <div className="field">
          <label>Amount</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Date</label>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div className="field">
          <label>Category</label>
          <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            <option value="">Uncategorized</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field" style={{ flex: 1, minWidth: 180 }}>
          <label>Note</label>
          <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </div>
        <button className="btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
      </div>
      {error && <p className="error-text">{error}</p>}
    </form>
  );
};

export default TransactionForm;
