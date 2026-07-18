import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';

const BalanceOverTimeChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="muted">No transactions in this range yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="date" tickFormatter={(d) => formatDate(d)} minTickGap={30} fontSize={12} />
        <YAxis tickFormatter={(v) => formatCurrency(v)} width={90} fontSize={12} />
        <Tooltip labelFormatter={(d) => formatDate(d)} formatter={(value) => formatCurrency(value)} />
        <Area type="monotone" dataKey="balance" stroke="#4f46e5" fill="url(#balanceFill)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default BalanceOverTimeChart;
