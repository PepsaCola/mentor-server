import { Router } from 'express';

import dashboardController from '../controllers/dashboardController.js';
import authenticate from '../middleware/authenticate.js';

const dashboardRouter = Router();

dashboardRouter.use(authenticate);

dashboardRouter.get('/summary', dashboardController.getSummary);

export default dashboardRouter;
