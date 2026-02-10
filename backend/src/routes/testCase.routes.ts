import { Router } from 'express';
import { testCaseController } from '../controllers/testCase.controller';

const router = Router();

// Test case CRUD
router.get('/', testCaseController.getAll);
router.get('/:id', testCaseController.getById);
router.post('/', testCaseController.create);
router.put('/:id', testCaseController.update);
router.delete('/:id', testCaseController.delete);

// Test case tags
router.post('/:id/tags', testCaseController.addTag);
router.delete('/:id/tags/:tagId', testCaseController.removeTag);

// Test case executions & stats
router.get('/:id/executions', testCaseController.getExecutions);
router.get('/:id/stats', testCaseController.getStats);

export default router;
