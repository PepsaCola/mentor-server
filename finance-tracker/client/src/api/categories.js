import client from './client.js';

export const listCategories = () => client.get('/categories').then((res) => res.data.categories);
export const createCategory = (data) => client.post('/categories', data).then((res) => res.data.category);
export const updateCategory = (id, data) => client.put(`/categories/${id}`, data).then((res) => res.data.category);
export const deleteCategory = (id) => client.delete(`/categories/${id}`);
