import client from './client.js';

export const getSummary = (params) =>
  client.get('/dashboard/summary', { params }).then((res) => res.data);
