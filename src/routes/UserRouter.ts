import { Router } from 'express';
import { UserController } from '../controllers';

const router = Router();

router.get('/:id', UserController.getUser);

router.get('/', UserController.getList);

export default router;
