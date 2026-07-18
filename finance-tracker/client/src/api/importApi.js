import client from './client.js';

export const previewImport = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return client
    .post('/import/preview', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data);
};

export const confirmImport = (rows) =>
  client.post('/import/confirm', { rows }).then((res) => res.data);
