//router index file
import { Router } from 'express';
import UserRouter from './UserRouter';
import PropertyRouter from './PropertyRouter';
import MatchRouter from './MatchRouter';

const router = Router();
router.use('/user', UserRouter);
router.use('/property', PropertyRouter);
router.use('/match', MatchRouter);

export default router;
