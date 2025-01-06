import { Router } from 'express';
import { MatchController } from '../controllers';

const router = Router();

router.post('/tenant-swipe', MatchController.createTenantSwipe);
router.post('/landlord-swipe', MatchController.createLandlordSwipe);
router.get('/', MatchController.getList);

export default router;
