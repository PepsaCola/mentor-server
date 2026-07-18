import { Router } from 'express';

import importController from '../controllers/importController.js';
import authenticate from '../middleware/authenticate.js';
import upload from '../middleware/upload.js';

const importRouter = Router();

importRouter.use(authenticate);

importRouter.post('/preview', upload.single('file'), importController.previewImport);
importRouter.post('/confirm', importController.confirmImport);

export default importRouter;
