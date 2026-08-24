import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { resourceRouter } from './resource.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/resources', resourceRouter);
