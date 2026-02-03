import { Router } from 'express';
import tagsController from '../controllers/tags.controller';

const router = Router();

// Tag CRUD
router.get('/', tagsController.getAllTags.bind(tagsController));
router.get('/:id', tagsController.getTagById.bind(tagsController));
router.post('/', tagsController.createTag.bind(tagsController));
router.put('/:id', tagsController.updateTag.bind(tagsController));
router.delete('/:id', tagsController.deleteTag.bind(tagsController));

export default router;
