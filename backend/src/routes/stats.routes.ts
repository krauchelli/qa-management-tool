import { Router } from 'express';
import statsController from '../controllers/stats.controller';

const router = Router();

// Stats routes
router.get('/', statsController.getStats.bind(statsController));

export default router;
