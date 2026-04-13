import { Router } from 'express';
import controller from '../controllers/dataTransfer.controller';

const router = Router();

router.get('/export/json', controller.exportJSON.bind(controller));
router.get('/export/zip', controller.exportZIP.bind(controller));
router.post('/import', controller.importJSON.bind(controller));
router.get('/preview', controller.preview.bind(controller));

export default router;
