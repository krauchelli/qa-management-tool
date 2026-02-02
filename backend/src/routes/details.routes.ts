import { Router } from 'express';
import detailsController from '../controllers/details.controller';

const router = Router();

// Detail routes
router.get('/:testId', detailsController.getDetailByTestId.bind(detailsController));
router.get('/:testId/template', detailsController.getDetailTemplate.bind(detailsController));
router.post('/', detailsController.createDetail.bind(detailsController));
router.put('/:testId', detailsController.updateDetail.bind(detailsController));
router.delete('/:testId', detailsController.deleteDetail.bind(detailsController));

export default router;
