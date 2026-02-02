import { Request, Response, NextFunction } from 'express';
import detailService from '../services/detail.service';
import testService from '../services/test.service';
import { CreateDetailDto, UpdateDetailDto } from '../types';

export class DetailsController {
  /**
   * GET /api/details/:testId
   * Get detail by test ID
   */
  async getDetailByTestId(req: Request, res: Response, next: NextFunction) {
    try {
      const { testId } = req.params;
      const detail = await detailService.getDetailByTestId(testId as string);
      
      if (!detail) {
        return res.status(404).json({ error: 'Detail not found' });
      }
      
      res.json(detail);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/details
   * Create detail file
   */
  async createDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateDetailDto = req.body;
      const detail = await detailService.createDetail(data);
      res.status(201).json(detail);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/details/:testId
   * Update detail file
   */
  async updateDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { testId } = req.params;
      const data: UpdateDetailDto = req.body;
      const detail = await detailService.updateDetail(testId as string, data);
      res.json(detail);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/details/:testId
   * Delete detail file
   */
  async deleteDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { testId } = req.params;
      const result = await detailService.deleteDetail(testId as string);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/details/:testId/template
   * Generate detail template for a test
   */
  async getDetailTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const { testId } = req.params;
      const test = await testService.getTestById(testId as string);
      const template = detailService.generateDetailTemplate(test);
      res.json({ template });
    } catch (error) {
      next(error);
    }
  }
}

export default new DetailsController();
