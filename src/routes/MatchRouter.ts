import { Router } from 'express';
import { MatchController } from '../controllers';

const router = Router();

router.post('/tenant-swipe', MatchController.createTenantSwipe);

export default router;
