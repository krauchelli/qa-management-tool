import { Request, Response } from 'express';
import tagService from '../services/tag.service';

export class TagsController {
  /**
   * GET /api/tags
   */
  async getAllTags(req: Request, res: Response) {
    try {
      const tags = await tagService.getAllTags();
      res.json(tags);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/tags/:id
   */
  async getTagById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const tag = await tagService.getTagById(id);
      res.json(tag);
    } catch (error: any) {
      if (error.message === 'Tag not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  /**
   * POST /api/tags
   */
  async createTag(req: Request, res: Response) {
    try {
      const tag = await tagService.createTag(req.body);
      res.status(201).json(tag);
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  /**
   * PUT /api/tags/:id
   */
  async updateTag(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const tag = await tagService.updateTag(id, req.body);
      res.json(tag);
    } catch (error: any) {
      if (error.message === 'Tag not found') {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes('already exists')) {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  /**
   * DELETE /api/tags/:id
   */
  async deleteTag(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const result = await tagService.deleteTag(id);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Tag not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  /**
   * POST /api/tests/:testId/tags
   */
  async addTagToTest(req: Request, res: Response) {
    try {
      const testId = req.params.testId as string;
      const { tagId } = req.body;

      if (!tagId) {
        return res.status(400).json({ error: 'tagId is required' });
      }

      const testTag = await tagService.addTagToTest(testId, tagId);
      res.status(201).json(testTag);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * DELETE /api/tests/:testId/tags/:tagId
   */
  async removeTagFromTest(req: Request, res: Response) {
    try {
      const testId = req.params.testId as string;
      const tagId = req.params.tagId as string;
      const result = await tagService.removeTagFromTest(testId, tagId);
      res.json(result);
    } catch (error: any) {
      if (error.message === 'Tag not found on test') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  /**
   * GET /api/tests/:testId/tags
   */
  async getTestTags(req: Request, res: Response) {
    try {
      const testId = req.params.testId as string;
      const tags = await tagService.getTestTags(testId);
      res.json(tags);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new TagsController();
