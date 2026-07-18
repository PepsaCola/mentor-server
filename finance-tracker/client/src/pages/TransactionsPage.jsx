import { useEffect, useState } from 'react';

import * as transactionsApi from '../api/transactions.js';
import * as categoriesApi from '../api/categories.js';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionTable from '../components/TransactionTable.jsx';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTransactions = () => transactionsApi.listTransactions().then((data) => setTransactions(data.transactions));

  useEffect(() => {
    Promise.all([loadTransactions(), categoriesApi.listCategories().then(setCategories)]).finally(() =>
      setIsLoading(false)
    );
  }, []);

  const handleCreate = async (data) => {
    await transactionsApi.createTransaction(data);
    await loadTransactions();
  };

  const handleDelete = async (id) => {
    await transactionsApi.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div>
      <div className="page-header">
        <h2>Transactions</h2>
      </div>
      <TransactionForm categories={categories} onCreate={handleCreate} />
      {isLoading ? <p className="muted">Loading...</p> : <TransactionTable transactions={transactions} onDelete={handleDelete} />}
    </div>
  );
};

export default TransactionsPage;
