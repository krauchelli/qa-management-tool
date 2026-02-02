import prisma from '../utils/prisma';
import { CreateDetailDto, UpdateDetailDto } from '../types';

export class DetailService {
  /**
   * Get detail by test ID
   */
  async getDetailByTestId(testId: string) {
    const detail = await prisma.detail.findUnique({
      where: { testId },
      include: {
        test: true,
      },
    });

    // Return null if not found instead of throwing error
    // This allows frontend to handle "no details yet" gracefully
    return detail;
  }

  /**
   * Create detail file
   */
  async createDetail(data: CreateDetailDto) {
    // Check if detail already exists for this test
    const existing = await prisma.detail.findUnique({
      where: { testId: data.testId },
    });

    if (existing) {
      throw new Error('Detail already exists for this test');
    }

    const detail = await prisma.detail.create({
      data,
      include: {
        test: true,
      },
    });

    // Update test with detail file path
    await prisma.test.update({
      where: { id: data.testId },
      data: {
        detailFile: `test-details/${data.title.toLowerCase().replace(/\s+/g, '-')}`,
      },
    });

    return detail;
  }

  /**
   * Update detail file
   */
  async updateDetail(testId: string, data: UpdateDetailDto) {
    // Check if detail exists
    const existing = await this.getDetailByTestId(testId);
    
    if (!existing) {
      throw new Error('Detail not found');
    }

    const detail = await prisma.detail.update({
      where: { testId },
      data,
      include: {
        test: true,
      },
    });

    return detail;
  }

  /**
   * Delete detail file
   */
  async deleteDetail(testId: string) {
    // Check if detail exists
    const existing = await this.getDetailByTestId(testId);
    
    if (!existing) {
      throw new Error('Detail not found');
    }

    await prisma.detail.delete({
      where: { testId },
    });

    // Remove detail file path from test
    await prisma.test.update({
      where: { id: testId },
      data: {
        detailFile: null,
      },
    });

    return { success: true, message: 'Detail deleted successfully' };
  }

  /**
   * Generate detail template for a test
   */
  generateDetailTemplate(test: any): string {
    const jiraNum = test.jira || '-';
    const statusText = this.statusToDisplay(test.status);
    const evidenceLinks = test.evidence
      ?.map((e: any) => `- ${e.description || e.type}: ${e.url}`)
      .join('\n') || '- [Add evidence links]';

    return `# ${jiraNum} - ${test.feature}

**Status:** ${statusText}  
**Date Tested:** ${test.date}  
**Environment:** ${test.env}  
**Jira:** ${test.jiraUrl ? `[#${test.jira}](${test.jiraUrl})` : '-'}

---

## Test Scenario

[Describe what you're testing]

---

## Steps to Reproduce

1. [Step 1]
2. [Step 2]
3. [Step 3]

---

## Expected Result

[What should happen]

---

## Actual Result

[What actually happened]

---

## Test Evidence

${evidenceLinks}

---

## Notes

[Additional observations, patterns, or findings]

---

## Root Cause Analysis (Hypothesis)

[Your analysis of what might be causing the issue]

---

## Related Issues

- [Related Jira or test]

---

*Last updated: ${test.date}*
`;
  }

  /**
   * Convert status to display text
   */
  private statusToDisplay(status: string): string {
    switch (status) {
      case 'PASSED':
        return '✅ Passed';
      case 'FAILED':
        return '🔴 Failed';
      case 'IN_PROGRESS':
        return '🟡 In Progress';
      case 'NEED_CONFIRMATION':
        return '❓ Need Confirmation';
      default:
        return status;
    }
  }
}

export default new DetailService();
