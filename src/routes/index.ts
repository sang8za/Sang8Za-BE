//router index file
import { Router } from 'express';
import UserRouter from './UserRouter';
import PropertyRouter from './PropertyRouter';

const router = Router();
router.use('/user', UserRouter);
router.use('/property', PropertyRouter);

export default router;
