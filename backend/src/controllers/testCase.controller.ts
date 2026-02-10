import { Request, Response } from 'express';
import { testCaseService } from '../services/testCase.service';
import type { CreateTestCaseDto, UpdateTestCaseDto, TestCaseFilters } from '../types';

export const testCaseController = {
  // GET /api/test-cases
  async getAll(req: Request, res: Response) {
    try {
      const filters: TestCaseFilters = {
        search: req.query.search as string,
        priority: req.query.priority as any,
        tagIds: req.query.tagIds ? (req.query.tagIds as string).split(',') : undefined,
        sortBy: (req.query.sortBy as any) || 'createdAt',
        sortOrder: (req.query.sortOrder as any) || 'desc',
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      };

      const result = await testCaseService.getAll(filters);
      res.json(result);
    } catch (error: any) {
      console.error('Error fetching test cases:', error);
      res.status(500).json({ error: 'Failed to fetch test cases', details: error.message });
    }
  },

  // GET /api/test-cases/:id
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const testCase = await testCaseService.getByIdWithStats(id as string);

      if (!testCase) {
        return res.status(404).json({ error: 'Test case not found' });
      }

      res.json(testCase);
    } catch (error: any) {
      console.error('Error fetching test case:', error);
      res.status(500).json({ error: 'Failed to fetch test case', details: error.message });
    }
  },

  // POST /api/test-cases
  async create(req: Request, res: Response) {
    try {
      const data: CreateTestCaseDto = req.body;

      // Validation
      if (!data.title || !data.steps || !data.expected) {
        return res.status(400).json({ 
          error: 'Missing required fields', 
          details: 'title, steps, and expected are required' 
        });
      }

      if (!data.priority) {
        data.priority = 'MEDIUM';
      }

      if (!data.tagIds) {
        data.tagIds = [];
      }

      const testCase = await testCaseService.create(data);
      res.status(201).json(testCase);
    } catch (error: any) {
      console.error('Error creating test case:', error);
      res.status(500).json({ error: 'Failed to create test case', details: error.message });
    }
  },

  // PUT /api/test-cases/:id
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdateTestCaseDto = req.body;

      const testCase = await testCaseService.update(id as string, data);
      res.json(testCase);
    } catch (error: any) {
      console.error('Error updating test case:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Test case not found' });
      }
      
      res.status(500).json({ error: 'Failed to update test case', details: error.message });
    }
  },

  // DELETE /api/test-cases/:id
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await testCaseService.delete(id as string);
      res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting test case:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Test case not found' });
      }
      
      res.status(500).json({ error: 'Failed to delete test case', details: error.message });
    }
  },

  // POST /api/test-cases/:id/tags
  async addTag(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { tagId } = req.body;

      if (!tagId) {
        return res.status(400).json({ error: 'tagId is required' });
      }

      await testCaseService.addTag(id as string, tagId);
      res.status(201).json({ message: 'Tag added successfully' });
    } catch (error: any) {
      console.error('Error adding tag to test case:', error);
      
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Tag already added to this test case' });
      }
      
      res.status(500).json({ error: 'Failed to add tag', details: error.message });
    }
  },

  // DELETE /api/test-cases/:id/tags/:tagId
  async removeTag(req: Request, res: Response) {
    try {
      const { id, tagId } = req.params;
      await testCaseService.removeTag(id as string, tagId as string);
      res.status(204).send();
    } catch (error: any) {
      console.error('Error removing tag from test case:', error);
      res.status(500).json({ error: 'Failed to remove tag', details: error.message });
    }
  },

  // GET /api/test-cases/:id/executions
  async getExecutions(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const executions = await testCaseService.getExecutions(id as string);
      res.json(executions);
    } catch (error: any) {
      console.error('Error fetching executions:', error);
      res.status(500).json({ error: 'Failed to fetch executions', details: error.message });
    }
  },

  // GET /api/test-cases/:id/stats
  async getStats(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const stats = await testCaseService.getStats(id as string);
      res.json(stats);
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
    }
  },
};
