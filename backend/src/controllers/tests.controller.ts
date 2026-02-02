import { Request, Response, NextFunction } from 'express';
import testService from '../services/test.service';
import { CreateTestDto, UpdateTestDto, TestFilters } from '../types';

export class TestsController {
  /**
   * GET /api/tests
   * Get all tests with optional filters, sorting, and pagination
   */
  async getAllTests(req: Request, res: Response, next: NextFunction) {
    try {
      const filters: TestFilters = {
        status: req.query.status as any,
        env: req.query.env as any,
        search: req.query.search as string,
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      };

      const result = await testService.getAllTests(filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tests/:id
   * Get single test by ID
   */
  async getTestById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const test = await testService.getTestById(id as string);
      res.json(test);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/tests
   * Create new test
   */
  async createTest(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateTestDto = req.body;
      const test = await testService.createTest(data);
      res.status(201).json(test);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/tests/:id
   * Update test
   */
  async updateTest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data: UpdateTestDto = req.body;
      const test = await testService.updateTest(id as string, data);
      res.json(test);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/tests/:id
   * Delete test
   */
  async deleteTest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await testService.deleteTest(id as string);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/tests/:id/evidence
   * Add evidence to test
   */
  async addEvidence(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const evidence = req.body;
      const result = await testService.addEvidence(id as string, evidence);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/tests/:testId/evidence/:evidenceId
   * Delete evidence
   */
  async deleteEvidence(req: Request, res: Response, next: NextFunction) {
    try {
      const { evidenceId } = req.params;
      const result = await testService.deleteEvidence(evidenceId as string);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new TestsController();
