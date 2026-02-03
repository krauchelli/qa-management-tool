import { Router } from 'express';
import testsController from '../controllers/tests.controller';
import tagsController from '../controllers/tags.controller';

const router = Router();

// Test routes
router.get('/', testsController.getAllTests.bind(testsController));
router.get('/:id', testsController.getTestById.bind(testsController));
router.post('/', testsController.createTest.bind(testsController));
router.put('/:id', testsController.updateTest.bind(testsController));
router.delete('/:id', testsController.deleteTest.bind(testsController));

// Evidence routes
router.post('/:id/evidence', testsController.addEvidence.bind(testsController));
router.delete('/:testId/evidence/:evidenceId', testsController.deleteEvidence.bind(testsController));

// Tag routes
router.get('/:testId/tags', tagsController.getTestTags.bind(tagsController));
router.post('/:testId/tags', tagsController.addTagToTest.bind(tagsController));
router.delete('/:testId/tags/:tagId', tagsController.removeTagFromTest.bind(tagsController));

export default router;
