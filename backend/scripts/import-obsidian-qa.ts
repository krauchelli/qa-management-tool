import prisma from '../src/utils/prisma';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Import test entries from the Obsidian QA - TestT.md file.
 * Parses the chronological daily log and creates test entries
 * for significant findings with Jira tickets and evidence.
 */

interface ParsedEntry {
  date: string;
  feature: string;
  jira: string | null;
  jiraUrl: string | null;
  status: string;
  env: string;
  notes: string;
  evidence: Array<{ type: string; url: string; description?: string }>;
}

function parseObsidianFile(filePath: string): ParsedEntry[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const entries: ParsedEntry[] = [];

  // Extract entries with Jira tickets that have clear status
  const jiraEntries: Array<{
    date: string;
    jira: string;
    status: string;
    env: string;
    description: string;
    evidence: string[];
  }> = [];

  let currentDate = '';
  let currentEnv = 'DEV';
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match date headers like "### 2025-07-03" or "### 2025-07-06 - 09"
    const dateMatch = line.match(/^###\s+(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      currentDate = dateMatch[1];
      currentEnv = 'DEV'; // default
      continue;
    }

    // Match environment headers
    if (/^-\s*(Dev|Staging|Prod|App \(Prod\))/i.test(line.trim())) {
      const envMatch = line.match(/(Dev|Staging|Prod)/i);
      if (envMatch) {
        currentEnv = envMatch[1].toUpperCase();
        if (currentEnv === 'APP') currentEnv = 'PROD';
      }
      continue;
    }

    if (/####\s*Env\s*V2.*BPJS/i.test(line)) {
      currentEnv = 'STAGING';
      continue;
    }
    if (/####\s*V1/i.test(line)) {
      currentEnv = 'DEV';
      continue;
    }
    if (/####\s*V2/i.test(line)) {
      currentEnv = 'STAGING';
      continue;
    }

    // Match Jira ticket references with status
    const jiraMatch = line.match(/#(MD-\d+)/);
    if (jiraMatch && currentDate) {
      const jira = jiraMatch[1];

      // Determine status from emoji
      let status = 'IN_PROGRESS';
      if (line.includes('(✅)') || line.includes('{✅}')) status = 'PASSED';
      else if (line.includes('(🔴)') || line.includes('{🔴}')) status = 'FAILED';
      else if (line.includes('(🟡)') || line.includes('{🟡}')) status = 'IN_PROGRESS';
      else if (line.includes('(❓)') || line.includes('{❓}')) status = 'NEED_CONFIRMATION';

      // Extract description (clean up markdown)
      let description = line
        .replace(/^[\s\-\*\t]+/, '')
        .replace(/\[.*?\]\(.*?\)/g, '')
        .replace(/#MD-\d+/g, '')
        .replace(/[{(][✅🔴🟡❓][)}]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      // Extract evidence URLs
      const evidenceUrls: string[] = [];
      const urlRegex = /https:\/\/jam\.dev\/c\/[a-f0-9-]+/g;
      let urlMatch;
      while ((urlMatch = urlRegex.exec(line)) !== null) {
        evidenceUrls.push(urlMatch[0]);
      }
      // Check next few lines for evidence too
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const nextLine = lines[j];
        if (nextLine.match(/^###\s/) || nextLine.match(/#MD-\d+/)) break;
        while ((urlMatch = urlRegex.exec(nextLine)) !== null) {
          evidenceUrls.push(urlMatch[0]);
        }
      }

      jiraEntries.push({
        date: currentDate,
        jira: jira,
        status,
        env: currentEnv,
        description,
        evidence: [...new Set(evidenceUrls)],
      });
    }
  }

  // Deduplicate by Jira ticket - keep the latest entry per ticket
  const byJira = new Map<string, typeof jiraEntries[0]>();
  for (const entry of jiraEntries) {
    const existing = byJira.get(entry.jira);
    if (!existing || entry.date >= existing.date) {
      byJira.set(entry.jira, entry);
    }
  }

  for (const entry of byJira.values()) {
    entries.push({
      date: entry.date,
      feature: entry.description || `Jira ${entry.jira}`,
      jira: entry.jira,
      jiraUrl: `https://mymedicaid.atlassian.net/browse/${entry.jira}`,
      status: entry.status,
      env: entry.env,
      notes: null,
      evidence: entry.evidence.map((url) => ({
        type: 'jam.dev',
        url,
        description: `Evidence for ${entry.jira}`,
      })),
    });
  }

  return entries.sort((a, b) => a.date.localeCompare(b.date));
}

async function main() {
  const filePath = path.resolve(__dirname, '../../obsidian-qa-test.md');

  if (!fs.existsSync(filePath)) {
    console.error('❌ File not found:', filePath);
    process.exit(1);
  }

  console.log('📖 Parsing Obsidian QA file...\n');
  const entries = parseObsidianFile(filePath);
  console.log(`Found ${entries.length} unique Jira-tracked entries\n`);

  // Check existing tests to avoid duplicates
  const existingTests = await prisma.test.findMany({
    select: { jira: true },
  });
  const existingJiras = new Set(
    existingTests.map((t) => t.jira?.replace('#', '')).filter(Boolean)
  );

  let imported = 0;
  let skipped = 0;

  for (const entry of entries) {
    const jiraClean = entry.jira?.replace('#', '');
    if (jiraClean && existingJiras.has(jiraClean)) {
      console.log(`  ⏭ ${entry.jira} - already exists, skipping`);
      skipped++;
      continue;
    }

    try {
      const test = await prisma.test.create({
        data: {
          date: entry.date,
          feature: entry.feature.substring(0, 200) || `${entry.jira}`,
          jira: entry.jira,
          jiraUrl: entry.jiraUrl,
          status: entry.status,
          env: entry.env,
          notes: entry.notes,
          evidence: {
            create: entry.evidence,
          },
        },
      });
      console.log(`  ✅ ${entry.jira} - ${entry.feature.substring(0, 60)} (${entry.status})`);
      imported++;
    } catch (err: any) {
      console.log(`  ❌ ${entry.jira} - ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`  Imported: ${imported}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Total in DB: ${(await prisma.test.count())}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
