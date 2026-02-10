/**
 * Restore Database From Backup
 * 
 * This script restores data from a backup JSON file.
 * Use this if migration fails or data is lost.
 * 
 * Usage: npm run restore-backup <backup-file.json>
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface BackupData {
  timestamp: string;
  version: string;
  tests: any[];
  evidence: any[];
  details: any[];
  tags: any[];
  testTags: any[];
}

async function restoreDatabase(backupFilePath: string) {
  console.log('🔄 Starting database restore...\n');

  try {
    // Check if backup file exists
    if (!fs.existsSync(backupFilePath)) {
      console.error(`❌ Backup file not found: ${backupFilePath}`);
      console.log('\n💡 Available backups:');
      const backupDir = path.join(__dirname, '../backups');
      if (fs.existsSync(backupDir)) {
        const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.json'));
        files.forEach(f => console.log(`   - ${f}`));
      }
      process.exit(1);
    }

    // Read backup file
    console.log('📖 Reading backup file...');
    const backupContent = fs.readFileSync(backupFilePath, 'utf-8');
    const backupData: BackupData = JSON.parse(backupContent);
    console.log(`   ✓ Backup from: ${backupData.timestamp}`);
    console.log(`   ✓ Version: ${backupData.version}\n`);

    // Confirm restore
    console.log('⚠️  WARNING: This will DELETE all current data and restore from backup!');
    console.log('📊 Backup contains:');
    console.log(`   - Tests: ${backupData.tests.length}`);
    console.log(`   - Tags: ${backupData.tags.length}`);
    console.log(`   - Evidence: ${backupData.evidence.length}`);
    console.log(`   - Details: ${backupData.details.length}`);
    console.log(`   - Test-Tag relationships: ${backupData.testTags.length}\n`);

    // Clear existing data (in reverse order of dependencies)
    console.log('🗑️  Clearing existing data...');
    await prisma.testTag.deleteMany();
    console.log('   ✓ Cleared test-tag relationships');
    
    await prisma.detail.deleteMany();
    console.log('   ✓ Cleared details');
    
    await prisma.evidence.deleteMany();
    console.log('   ✓ Cleared evidence');
    
    await prisma.test.deleteMany();
    console.log('   ✓ Cleared tests');
    
    await prisma.tag.deleteMany();
    console.log('   ✓ Cleared tags\n');

    // Restore tags first (no dependencies)
    console.log('📥 Restoring tags...');
    for (const tag of backupData.tags) {
      await prisma.tag.create({
        data: {
          id: tag.id,
          name: tag.name,
          color: tag.color,
          category: tag.category,
          createdAt: new Date(tag.createdAt)
        }
      });
    }
    console.log(`   ✓ Restored ${backupData.tags.length} tags`);

    // Restore tests (without relations)
    console.log('📥 Restoring tests...');
    for (const test of backupData.tests) {
      await prisma.test.create({
        data: {
          id: test.id,
          date: test.date,
          feature: test.feature,
          jira: test.jira,
          jiraUrl: test.jiraUrl,
          status: test.status,
          env: test.env,
          notes: test.notes,
          detailFile: test.detailFile,
          createdAt: new Date(test.createdAt),
          updatedAt: new Date(test.updatedAt)
        }
      });
    }
    console.log(`   ✓ Restored ${backupData.tests.length} tests`);

    // Restore evidence
    console.log('📥 Restoring evidence...');
    for (const ev of backupData.evidence) {
      await prisma.evidence.create({
        data: {
          id: ev.id,
          testId: ev.testId,
          type: ev.type,
          url: ev.url,
          description: ev.description
        }
      });
    }
    console.log(`   ✓ Restored ${backupData.evidence.length} evidence records`);

    // Restore details
    console.log('📥 Restoring details...');
    for (const detail of backupData.details) {
      await prisma.detail.create({
        data: {
          id: detail.id,
          testId: detail.testId,
          title: detail.title,
          content: detail.content,
          createdAt: new Date(detail.createdAt),
          updatedAt: new Date(detail.updatedAt)
        }
      });
    }
    console.log(`   ✓ Restored ${backupData.details.length} detail records`);

    // Restore test-tag relationships
    console.log('📥 Restoring test-tag relationships...');
    for (const testTag of backupData.testTags) {
      await prisma.testTag.create({
        data: {
          id: testTag.id,
          testId: testTag.testId,
          tagId: testTag.tagId,
          createdAt: new Date(testTag.createdAt)
        }
      });
    }
    console.log(`   ✓ Restored ${backupData.testTags.length} test-tag relationships`);

    console.log('\n✅ Restore completed successfully!\n');

  } catch (error) {
    console.error('❌ Restore failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get backup file from command line argument
const backupFile = process.argv[2];

if (!backupFile) {
  console.error('❌ Please provide backup file path');
  console.log('\nUsage: npm run restore-backup <backup-file.json>');
  console.log('Example: npm run restore-backup backups/backup-2026-02-04.json\n');
  process.exit(1);
}

// Resolve path
const backupPath = path.isAbsolute(backupFile) 
  ? backupFile 
  : path.join(__dirname, '..', backupFile);

restoreDatabase(backupPath);
