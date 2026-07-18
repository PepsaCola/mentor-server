import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import * as dashboardApi from '../api/dashboard.js';
import StatCard from '../components/StatCard.jsx';
import SpendingByCategoryChart from '../components/charts/SpendingByCategoryChart.jsx';
import BalanceOverTimeChart from '../components/charts/BalanceOverTimeChart.jsx';

const DashboardPage = () => {
  const [range, setRange] = useState({
    from: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    to: dayjs().format('YYYY-MM-DD'),
  });
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    dashboardApi
      .getSummary(range)
      .then(setSummary)
      .finally(() => setIsLoading(false));
  }, [range]);

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <div className="form-row">
          <div className="field">
            <label>From</label>
            <input type="date" value={range.from} onChange={(e) => setRange({ ...range, from: e.target.value })} />
          </div>
          <div className="field">
            <label>To</label>
            <input type="date" value={range.to} onChange={(e) => setRange({ ...range, to: e.target.value })} />
          </div>
        </div>
      </div>

      {isLoading || !summary ? (
        <p className="muted">Loading...</p>
      ) : (
        <>
          <div className="stat-row">
            <StatCard label="Income" value={summary.totalIncome} tone="income" />
            <StatCard label="Expenses" value={summary.totalExpense} tone="expense" />
            <StatCard label="Balance" value={summary.balance} />
          </div>
          <div className="charts-row">
            <div className="card">
              <h3>Spending by category</h3>
              <SpendingByCategoryChart data={summary.byCategory} />
            </div>
            <div className="card">
              <h3>Balance over time</h3>
              <BalanceOverTimeChart data={summary.balanceOverTime} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
