import { Request, Response, NextFunction } from 'express';
import dataTransferService from '../services/dataTransfer.service';

export class DataTransferController {
  /**
   * GET /api/data/export/json
   * Export all data as JSON
   */
  async exportJSON(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dataTransferService.exportJSON();
      const filename = `qa-export-${new Date().toISOString().split('T')[0]}.json`;
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/json');
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/data/export/zip
   * Export all data as ZIP (JSON + markdown files)
   */
  async exportZIP(req: Request, res: Response, next: NextFunction) {
    try {
      const filename = `qa-export-${new Date().toISOString().split('T')[0]}.zip`;
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/zip');
      await dataTransferService.exportZIP(res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/data/import
   * Import data from JSON export
   * Body: { data: ExportData, mode: 'replace' | 'merge' }
   */
  async importJSON(req: Request, res: Response, next: NextFunction) {
    try {
      const { mode = 'merge' } = req.query;
      const data = req.body;

      if (!data || !data.version || !data.data) {
        return res.status(400).json({
          error: 'Invalid import data. Expected QA Management Tool export format.',
          code: 'INVALID_FORMAT',
        });
      }

      const result = await dataTransferService.importJSON(
        data,
        mode as 'replace' | 'merge'
      );

      res.json({
        success: true,
        message: `Import completed (${mode} mode)`,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/data/preview
   * Get a count summary of current data (useful before import)
   */
  async preview(req: Request, res: Response, next: NextFunction) {
    try {
      const [tags, testCases, tests, details, evidence] = await Promise.all([
        (await import('../utils/prisma')).default.tag.count(),
        (await import('../utils/prisma')).default.testCase.count(),
        (await import('../utils/prisma')).default.test.count(),
        (await import('../utils/prisma')).default.detail.count(),
        (await import('../utils/prisma')).default.evidence.count(),
      ]);
      res.json({ tags, testCases, tests, details, evidence });
    } catch (error) {
      next(error);
    }
  }
}

export default new DataTransferController();
