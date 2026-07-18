import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const DATE_FORMATS = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];

const CsvColumnMapper = ({ preview, categories, onConfirm, onCancel }) => {
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [overrides, setOverrides] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const rows = useMemo(
    () =>
      preview.rows.map((row) => {
        const parsedDate = dayjs(row.date, dateFormat, true);
        return {
          ...row,
          parsedDate,
          categoryId: overrides[row.index] ?? row.suggestedCategoryId ?? '',
        };
      }),
    [preview.rows, dateFormat, overrides]
  );

  const invalidCount = rows.filter((row) => !row.parsedDate.isValid()).length;

  const handleCategoryChange = (index, categoryId) => {
    setOverrides((prev) => ({ ...prev, [index]: categoryId }));
  };

  const handleConfirm = async () => {
    if (invalidCount > 0) {
      setError(`${invalidCount} row(s) have a date that doesn't match the selected format`);
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const payloadRows = rows.map((row) => ({
        date: row.parsedDate.toISOString(),
        amount: row.amount,
        type: row.type,
        note: row.description,
        categoryId: row.categoryId || null,
      }));
      await onConfirm(payloadRows);
    } catch (err) {
      setError(err.response?.data?.message || 'Import failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoriesByType = (type) => categories.filter((c) => c.type === type);

  return (
    <div>
      <div className="form-row" style={{ marginBottom: 16 }}>
        <div className="field">
          <label>Date format</label>
          <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
            {DATE_FORMATS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <p className="muted">
          Detected columns — date: {preview.mapping.date ?? '—'}, description: {preview.mapping.description ?? '—'},
          amount: {preview.mapping.amount ?? `${preview.mapping.debit ?? '—'} / ${preview.mapping.credit ?? '—'}`}
        </p>
      </div>

      <div className="card" style={{ maxHeight: 420, overflowY: 'auto', marginBottom: 16 }}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.index}>
                <td style={{ color: row.parsedDate.isValid() ? 'inherit' : 'var(--color-expense)' }}>
                  {row.parsedDate.isValid() ? row.parsedDate.format('MMM D, YYYY') : row.date}
                </td>
                <td>{row.description}</td>
                <td className={`amount ${row.type === 'INCOME' ? 'income' : 'expense'}`}>
                  {row.amount.toFixed(2)}
                </td>
                <td>{row.type}</td>
                <td>
                  <select value={row.categoryId} onChange={(e) => handleCategoryChange(row.index, e.target.value)}>
                    <option value="">Uncategorized</option>
                    {categoriesByType(row.type).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="form-row">
        <button className="btn" onClick={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? 'Importing...' : `Import ${rows.length} transactions`}
        </button>
        <button className="btn secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CsvColumnMapper;
