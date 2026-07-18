import client from './client.js';

export const listBudgets = () => client.get('/budgets').then((res) => res.data.budgets);
export const upsertBudget = (data) => client.post('/budgets', data).then((res) => res.data.budget);
export const deleteBudget = (id) => client.delete(`/budgets/${id}`);
export const getBudgetProgress = (month) =>
  client.get('/dashboard/budgets', { params: { month } }).then((res) => res.data.progress);
