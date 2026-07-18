import express from 'express';
import cors from 'cors';

import authRouter from './routes/authRouter.js';
import categoryRouter from './routes/categoryRouter.js';
import transactionRouter from './routes/transactionRouter.js';
import importRouter from './routes/importRouter.js';
import dashboardRouter from './routes/dashboardRouter.js';
import budgetRouter from './routes/budgetRouter.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/import', importRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/budgets', budgetRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
