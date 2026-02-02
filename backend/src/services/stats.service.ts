import prisma from '../utils/prisma';
import { Stats } from '../types';

export class StatsService {
  /**
   * Calculate test statistics
   */
  async getStats(): Promise<Stats> {
    // Get all tests
    const allTests = await prisma.test.findMany({
      include: {
        evidence: true,
        detail: true,
      },
    });

    // Calculate counts by status
    const total = allTests.length;
    const passed = allTests.filter((t) => t.status === 'PASSED').length;
    const failed = allTests.filter((t) => t.status === 'FAILED').length;
    const inProgress = allTests.filter((t) => t.status === 'IN_PROGRESS').length;
    const needConfirmation = allTests.filter((t) => t.status === 'NEED_CONFIRMATION').length;

    // Calculate counts by environment
    const byEnv = {
      dev: allTests.filter((t) => t.env === 'DEV').length,
      staging: allTests.filter((t) => t.env === 'STAGING').length,
      prod: allTests.filter((t) => t.env === 'PROD').length,
    };

    // Get recent tests (last 5)
    const recentTests = await prisma.test.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        evidence: true,
        detail: true,
      },
    });

    return {
      total,
      passed,
      failed,
      inProgress,
      needConfirmation,
      byEnv,
      recentTests: recentTests as any,
    };
  }
}

export default new StatsService();
