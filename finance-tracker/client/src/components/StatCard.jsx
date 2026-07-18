import { formatCurrency } from '../utils/formatCurrency.js';

const StatCard = ({ label, value, tone }) => (
  <div className="stat-card">
    <div className="label">{label}</div>
    <div className={`value ${tone ?? ''}`}>{formatCurrency(value)}</div>
  </div>
);

export default StatCard;
