import { useEffect, useState } from 'react';

import * as importApi from '../api/importApi.js';
import * as categoriesApi from '../api/categories.js';
import CsvColumnMapper from '../components/CsvColumnMapper.jsx';

const ImportPage = () => {
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    categoriesApi.listCategories().then(setCategories);
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setError('');
    setResult(null);
    setIsUploading(true);
    try {
      const data = await importApi.previewImport(file);
      setPreview(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not read CSV file');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleConfirm = async (rows) => {
    const data = await importApi.confirmImport(rows);
    setResult(data.count);
    setPreview(null);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Import CSV</h2>
      </div>

      {!preview && (
        <div className="dropzone card">
          <p>Upload a bank statement CSV (Date, Description, Amount columns).</p>
          <input type="file" accept=".csv" onChange={handleFileChange} disabled={isUploading} />
          {isUploading && <p className="muted">Parsing file...</p>}
        </div>
      )}

      {error && <p className="error-text">{error}</p>}
      {result !== null && <p className="muted">Imported {result} transactions successfully.</p>}

      {preview && (
        <CsvColumnMapper
          preview={preview}
          categories={categories}
          onConfirm={handleConfirm}
          onCancel={() => setPreview(null)}
        />
      )}
    </div>
  );
};

export default ImportPage;
