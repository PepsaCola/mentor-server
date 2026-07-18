import { Router } from 'express';

import transactionController from '../controllers/transactionController.js';
import authenticate from '../middleware/authenticate.js';

const transactionRouter = Router();

transactionRouter.use(authenticate);

transactionRouter.get('/', transactionController.listTransactions);
transactionRouter.post('/', transactionController.createTransaction);
transactionRouter.put('/:id', transactionController.updateTransaction);
transactionRouter.delete('/:id', transactionController.deleteTransaction);

export default transactionRouter;
