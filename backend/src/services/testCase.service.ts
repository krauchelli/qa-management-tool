import prisma from '../utils/prisma';
import type {
  TestCase,
  TestCaseWithStats,
  CreateTestCaseDto,
  UpdateTestCaseDto,
  TestCaseFilters,
  PaginatedResponse,
} from '../types';

export const testCaseService = {
  // Get all test cases with filters and pagination
  async getAll(filters: TestCaseFilters = {}): Promise<PaginatedResponse<TestCase>> {
    const {
      search,
      priority,
      tagIds,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = filters;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { steps: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (priority) {
      where.priority = priority;
    }

    if (tagIds && tagIds.length > 0) {
      where.tags = {
        some: {
          tagId: { in: tagIds },
        },
      };
    }

    // Get total count
    const total = await prisma.testCase.count({ where });

    // Get paginated data
    const testCases = await prisma.testCase.findMany({
      where,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: testCases as any,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  },

  // Get test case by ID
  async getById(id: string): Promise<any> {
    return prisma.testCase.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        executions: {
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
          },
          orderBy: {
            date: 'desc',
          },
        },
      },
    });
  },

  // Get test case with statistics
  async getByIdWithStats(id: string): Promise<any> {
    const testCase = await prisma.testCase.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        executions: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!testCase) return null;

    // Calculate statistics
    const executionCount = testCase.executions?.length || 0;
    const passCount = testCase.executions?.filter((e: any) => e.status === 'PASSED').length || 0;
    const failCount = testCase.executions?.filter((e: any) => e.status === 'FAILED').length || 0;
    const lastTested = testCase.executions?.[0]?.date;

    return {
      ...testCase,
      executionCount,
      passCount,
      failCount,
      lastTested,
    };
  },

  // Create test case
  async create(data: CreateTestCaseDto): Promise<any> {
    const { tagIds, ...testCaseData } = data;

    const testCase = await prisma.testCase.create({
      data: {
        ...testCaseData,
        tags: {
          create: tagIds.map((tagId) => ({
            tagId,
          })),
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return testCase;
  },

  // Update test case
  async update(id: string, data: UpdateTestCaseDto): Promise<any> {
    return prisma.testCase.update({
      where: { id },
      data,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  },

  // Delete test case
  async delete(id: string): Promise<void> {
    await prisma.testCase.delete({
      where: { id },
    });
  },

  // Add tag to test case
  async addTag(testCaseId: string, tagId: string): Promise<void> {
    await prisma.testCaseTag.create({
      data: {
        testCaseId,
        tagId,
      },
    });
  },

  // Remove tag from test case
  async removeTag(testCaseId: string, tagId: string): Promise<void> {
    await prisma.testCaseTag.deleteMany({
      where: {
        testCaseId,
        tagId,
      },
    });
  },

  // Get execution history for test case
  async getExecutions(testCaseId: string) {
    return prisma.test.findMany({
      where: { testCaseId },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        evidence: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  },

  // Get statistics for test case
  async getStats(testCaseId: string) {
    const executions = await prisma.test.findMany({
      where: { testCaseId },
      select: {
        status: true,
        date: true,
      },
    });

    const total = executions.length;
    const passed = executions.filter((e: any) => e.status === 'PASSED').length;
    const failed = executions.filter((e: any) => e.status === 'FAILED').length;
    const inProgress = executions.filter((e: any) => e.status === 'IN_PROGRESS').length;
    const needConfirmation = executions.filter((e: any) => e.status === 'NEED_CONFIRMATION').length;
    const lastTested = executions[0]?.date;

    return {
      total,
      passed,
      failed,
      inProgress,
      needConfirmation,
      passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
      lastTested,
    };
  },
};
