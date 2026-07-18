import { useEffect, useState } from 'react';

import * as categoriesApi from '../api/categories.js';
import * as budgetsApi from '../api/budgets.js';
import { formatCurrency } from '../utils/formatCurrency.js';

const BudgetsPage = () => {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState('');

  const load = () =>
    Promise.all([categoriesApi.listCategories(), budgetsApi.listBudgets()]).then(([cats, buds]) => {
      setCategories(cats.filter((c) => c.type === 'EXPENSE'));
      setBudgets(buds);
    });

  useEffect(() => {
    load().finally(() => setIsLoading(false));
  }, []);

  const budgetFor = (categoryId) => budgets.find((b) => b.categoryId === categoryId);

  const handleSave = async (categoryId) => {
    const amount = Number(drafts[categoryId]);
    if (!amount || amount <= 0) {
      setError('Enter a valid budget amount');
      return;
    }
    setError('');
    setSavingId(categoryId);
    try {
      await budgetsApi.upsertBudget({ categoryId, amount });
      await load();
      setDrafts((prev) => ({ ...prev, [categoryId]: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save budget');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    await budgetsApi.deleteBudget(id);
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  if (isLoading) return <p className="muted">Loading...</p>;

  return (
    <div>
      <div className="page-header">
        <h2>Monthly budgets</h2>
      </div>
      <p className="muted" style={{ marginBottom: 16 }}>
        Set a monthly spending limit per category. Progress shows on the dashboard for the current month.
      </p>
      {error && <p className="error-text">{error}</p>}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Current budget</th>
              <th>Set / update</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const budget = budgetFor(category.id);
              return (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{budget ? formatCurrency(budget.amount) : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        style={{ width: 110 }}
                        placeholder={budget ? String(budget.amount) : '0.00'}
                        value={drafts[category.id] ?? ''}
                        onChange={(e) => setDrafts({ ...drafts, [category.id]: e.target.value })}
                      />
                      <button
                        className="btn secondary"
                        onClick={() => handleSave(category.id)}
                        disabled={savingId === category.id}
                      >
                        {savingId === category.id ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </td>
                  <td>
                    {budget && (
                      <button className="btn secondary" onClick={() => handleDelete(budget.id)}>
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetsPage;
