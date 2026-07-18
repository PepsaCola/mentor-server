import client from './client.js';

export const register = (data) => client.post('/auth/register', data).then((res) => res.data);
export const login = (data) => client.post('/auth/login', data).then((res) => res.data);
export const getCurrentUser = () => client.get('/auth/me').then((res) => res.data);
