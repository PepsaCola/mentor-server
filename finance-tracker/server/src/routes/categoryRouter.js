import { Router } from 'express';

import categoryController from '../controllers/categoryController.js';
import authenticate from '../middleware/authenticate.js';

const categoryRouter = Router();

categoryRouter.use(authenticate);

categoryRouter.get('/', categoryController.listCategories);
categoryRouter.post('/', categoryController.createCategory);
categoryRouter.put('/:id', categoryController.updateCategory);
categoryRouter.delete('/:id', categoryController.deleteCategory);

export default categoryRouter;
