import { Router } from 'express';
import { PropertyController } from '../controllers';

const router = Router();

router.get('/:id', PropertyController.getList);

export default router;
