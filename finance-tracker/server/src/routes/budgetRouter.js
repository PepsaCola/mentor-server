import { Router } from 'express';

import budgetController from '../controllers/budgetController.js';
import authenticate from '../middleware/authenticate.js';

const budgetRouter = Router();

budgetRouter.use(authenticate);

budgetRouter.get('/', budgetController.listBudgets);
budgetRouter.post('/', budgetController.upsertBudget);
budgetRouter.delete('/:id', budgetController.deleteBudget);

export default budgetRouter;
