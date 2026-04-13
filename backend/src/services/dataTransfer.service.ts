import prisma from '../utils/prisma';
import archiver from 'archiver';
import { Writable } from 'stream';

export interface ExportData {
  version: string;
  exportedAt: string;
  data: {
    tags: any[];
    testCases: any[];
    tests: any[];
    details: any[];
    evidence: any[];
    testTags: any[];
    testCaseTags: any[];
  };
}

export class DataTransferService {
  /**
   * Export all data as JSON
   */
  async exportJSON(): Promise<ExportData> {
    const [tags, testCases, tests, details, evidence, testTags, testCaseTags] =
      await Promise.all([
        prisma.tag.findMany(),
        prisma.testCase.findMany(),
        prisma.test.findMany(),
        prisma.detail.findMany(),
        prisma.evidence.findMany(),
        prisma.testTag.findMany(),
        prisma.testCaseTag.findMany(),
      ]);

    return {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      data: {
        tags,
        testCases,
        tests,
        details,
        evidence,
        testTags,
        testCaseTags,
      },
    };
  }

  /**
   * Export as ZIP containing JSON + readable markdown summary
   */
  async exportZIP(outputStream: Writable): Promise<void> {
    const data = await this.exportJSON();

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(outputStream);

    // Main data file
    archive.append(JSON.stringify(data, null, 2), { name: 'qa-data.json' });

    // Human-readable summary
    const summary = this.generateSummary(data);
    archive.append(summary, { name: 'EXPORT-SUMMARY.md' });

    // Individual test details as markdown files
    for (const detail of data.data.details) {
      const test = data.data.tests.find((t: any) => t.id === detail.testId);
      const safeName = (test?.feature || detail.testId)
        .replace(/[^a-zA-Z0-9-_ ]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 60);
      archive.append(detail.content, {
        name: `test-details/${safeName}.md`,
      });
    }

    await archive.finalize();
  }

  private generateSummary(data: ExportData): string {
    const { tests, tags, testCases, details, evidence } = data.data;
    return `# QA Management Tool - Export Summary

**Exported:** ${data.exportedAt}
**Version:** ${data.version}

## Counts

| Entity | Count |
|--------|-------|
| Tests | ${tests.length} |
| Test Cases | ${testCases.length} |
| Tags | ${tags.length} |
| Details | ${details.length} |
| Evidence | ${evidence.length} |

## Tests by Status

| Status | Count |
|--------|-------|
| PASSED | ${tests.filter((t: any) => t.status === 'PASSED').length} |
| FAILED | ${tests.filter((t: any) => t.status === 'FAILED').length} |
| IN_PROGRESS | ${tests.filter((t: any) => t.status === 'IN_PROGRESS').length} |
| NEED_CONFIRMATION | ${tests.filter((t: any) => t.status === 'NEED_CONFIRMATION').length} |
| BACKLOG | ${tests.filter((t: any) => t.status === 'BACKLOG').length} |

## How to Import

Use the import endpoint or the web UI to import \`qa-data.json\` back into any QA Management Tool instance.

\`\`\`bash
curl -X POST http://localhost:3000/api/data/import \\
  -H "Content-Type: application/json" \\
  -d @qa-data.json
\`\`\`

Or use the Import feature in the web UI (Settings / Data Management).
`;
  }

  /**
   * Import data from JSON export
   */
  async importJSON(
    data: ExportData,
    mode: 'replace' | 'merge' = 'merge'
  ): Promise<{ imported: Record<string, number>; skipped: Record<string, number> }> {
    const imported: Record<string, number> = {};
    const skipped: Record<string, number> = {};

    if (mode === 'replace') {
      // Wipe everything in correct order (respect FK constraints)
      await prisma.testCaseTag.deleteMany();
      await prisma.testTag.deleteMany();
      await prisma.evidence.deleteMany();
      await prisma.detail.deleteMany();
      await prisma.test.deleteMany();
      await prisma.testCase.deleteMany();
      await prisma.tag.deleteMany();
    }

    // 1. Tags
    imported.tags = 0;
    skipped.tags = 0;
    for (const tag of data.data.tags) {
      try {
        if (mode === 'merge') {
          await prisma.tag.upsert({
            where: { id: tag.id },
            update: { name: tag.name, color: tag.color, category: tag.category },
            create: tag,
          });
        } else {
          await prisma.tag.create({ data: tag });
        }
        imported.tags++;
      } catch {
        skipped.tags++;
      }
    }

    // 2. Test Cases
    imported.testCases = 0;
    skipped.testCases = 0;
    for (const tc of data.data.testCases) {
      try {
        if (mode === 'merge') {
          await prisma.testCase.upsert({
            where: { id: tc.id },
            update: {
              title: tc.title,
              description: tc.description,
              steps: tc.steps,
              expected: tc.expected,
              priority: tc.priority,
            },
            create: tc,
          });
        } else {
          await prisma.testCase.create({ data: tc });
        }
        imported.testCases++;
      } catch {
        skipped.testCases++;
      }
    }

    // 3. Tests
    imported.tests = 0;
    skipped.tests = 0;
    for (const test of data.data.tests) {
      try {
        if (mode === 'merge') {
          await prisma.test.upsert({
            where: { id: test.id },
            update: {
              date: test.date,
              feature: test.feature,
              jira: test.jira,
              jiraUrl: test.jiraUrl,
              status: test.status,
              env: test.env,
              notes: test.notes,
              detailFile: test.detailFile,
              testCaseId: test.testCaseId,
            },
            create: test,
          });
        } else {
          await prisma.test.create({ data: test });
        }
        imported.tests++;
      } catch {
        skipped.tests++;
      }
    }

    // 4. Details
    imported.details = 0;
    skipped.details = 0;
    for (const detail of data.data.details) {
      try {
        if (mode === 'merge') {
          await prisma.detail.upsert({
            where: { id: detail.id },
            update: {
              title: detail.title,
              content: detail.content,
              testId: detail.testId,
            },
            create: detail,
          });
        } else {
          await prisma.detail.create({ data: detail });
        }
        imported.details++;
      } catch {
        skipped.details++;
      }
    }

    // 5. Evidence
    imported.evidence = 0;
    skipped.evidence = 0;
    for (const ev of data.data.evidence) {
      try {
        if (mode === 'merge') {
          await prisma.evidence.upsert({
            where: { id: ev.id },
            update: {
              type: ev.type,
              url: ev.url,
              description: ev.description,
              testId: ev.testId,
            },
            create: ev,
          });
        } else {
          await prisma.evidence.create({ data: ev });
        }
        imported.evidence++;
      } catch {
        skipped.evidence++;
      }
    }

    // 6. TestTags
    imported.testTags = 0;
    skipped.testTags = 0;
    for (const tt of data.data.testTags) {
      try {
        if (mode === 'merge') {
          await prisma.testTag.upsert({
            where: { id: tt.id },
            update: { testId: tt.testId, tagId: tt.tagId },
            create: tt,
          });
        } else {
          await prisma.testTag.create({ data: tt });
        }
        imported.testTags++;
      } catch {
        skipped.testTags++;
      }
    }

    // 7. TestCaseTags
    imported.testCaseTags = 0;
    skipped.testCaseTags = 0;
    for (const tct of data.data.testCaseTags) {
      try {
        if (mode === 'merge') {
          await prisma.testCaseTag.upsert({
            where: { id: tct.id },
            update: { testCaseId: tct.testCaseId, tagId: tct.tagId },
            create: tct,
          });
        } else {
          await prisma.testCaseTag.create({ data: tct });
        }
        imported.testCaseTags++;
      } catch {
        skipped.testCaseTags++;
      }
    }

    return { imported, skipped };
  }
}

export default new DataTransferService();
