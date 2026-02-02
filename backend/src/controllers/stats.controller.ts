import { Request, Response, NextFunction } from 'express';
import statsService from '../services/stats.service';

export class StatsController {
  /**
   * GET /api/stats
   * Get test statistics
   */
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await statsService.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export default new StatsController();
