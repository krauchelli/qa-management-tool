import prisma from '../utils/prisma';
import { CreateTestDto, UpdateTestDto, TestFilters } from '../types';

export class TestService {
  /**
   * Get all tests with optional filters, sorting, and pagination
   */
  async getAllTests(filters?: TestFilters) {
    const where: any = {};

    // Apply filters
    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.env) {
      where.env = filters.env;
    }

    if (filters?.search) {
      where.OR = [
        { feature: { contains: filters.search } },
        { jira: { contains: filters.search } },
        { notes: { contains: filters.search } },
      ];
    }

    if (filters?.dateFrom || filters?.dateTo) {
      where.date = {};
      if (filters.dateFrom) {
        where.date.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.date.lte = filters.dateTo;
      }
    }

    // Build orderBy
    const orderBy: any = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'desc';
    } else {
      orderBy.date = 'desc'; // Default sort
    }

    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await prisma.test.count({ where });

    // Get tests
    const tests = await prisma.test.findMany({
      where,
      include: {
        evidence: true,
        detail: true,
      },
      orderBy,
      skip,
      take: limit,
    });

    return {
      data: tests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  /**
   * Get single test by ID
   */
  async getTestById(id: string) {
    const test = await prisma.test.findUnique({
      where: { id },
      include: {
        evidence: true,
        detail: true,
      },
    });

    if (!test) {
      throw new Error('Test not found');
    }

    return test;
  }

  /**
   * Create new test
   */
  async createTest(data: CreateTestDto) {
    const { evidence, ...testData } = data;

    const test = await prisma.test.create({
      data: {
        ...testData,
        evidence: evidence
          ? {
              create: evidence,
            }
          : undefined,
      },
      include: {
        evidence: true,
        detail: true,
      },
    });

    return test;
  }

  /**
   * Update test
   */
  async updateTest(id: string, data: UpdateTestDto) {
    // Check if test exists
    await this.getTestById(id);

    const test = await prisma.test.update({
      where: { id },
      data,
      include: {
        evidence: true,
        detail: true,
      },
    });

    return test;
  }

  /**
   * Delete test
   */
  async deleteTest(id: string) {
    // Check if test exists
    await this.getTestById(id);

    await prisma.test.delete({
      where: { id },
    });

    return { success: true, message: 'Test deleted successfully' };
  }

  /**
   * Add evidence to test
   */
  async addEvidence(testId: string, evidence: { type: string; url: string; description?: string }) {
    // Check if test exists
    await this.getTestById(testId);

    const newEvidence = await prisma.evidence.create({
      data: {
        ...evidence,
        testId,
      },
    });

    return newEvidence;
  }

  /**
   * Delete evidence
   */
  async deleteEvidence(evidenceId: string) {
    await prisma.evidence.delete({
      where: { id: evidenceId },
    });

    return { success: true, message: 'Evidence deleted successfully' };
  }
}

export default new TestService();
