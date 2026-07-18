import client from './client.js';

export const listTransactions = (params) =>
  client.get('/transactions', { params }).then((res) => res.data);
export const createTransaction = (data) =>
  client.post('/transactions', data).then((res) => res.data.transaction);
export const updateTransaction = (id, data) =>
  client.put(`/transactions/${id}`, data).then((res) => res.data.transaction);
export const deleteTransaction = (id) => client.delete(`/transactions/${id}`);
