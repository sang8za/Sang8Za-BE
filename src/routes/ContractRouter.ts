import { Router } from 'express';
import { ContractController } from '../controllers';

const router = Router();

router.post('/', ContractController.createContract);

export default router;
