/**
 * Backup Database Before Migration
 * 
 * This script exports all data to JSON files before running migration.
 * Can be used to restore data if migration fails.
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

async function backupDatabase() {
  console.log('🔄 Starting database backup...\n');

  try {
    // Fetch all data
    console.log('📦 Fetching tests...');
    const tests = await prisma.test.findMany({
      include: {
        evidence: true,
        detail: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });
    console.log(`   ✓ Found ${tests.length} tests`);

    console.log('📦 Fetching tags...');
    const tags = await prisma.tag.findMany();
    console.log(`   ✓ Found ${tags.length} tags`);

    console.log('📦 Fetching evidence...');
    const evidence = await prisma.evidence.findMany();
    console.log(`   ✓ Found ${evidence.length} evidence records`);

    console.log('📦 Fetching details...');
    const details = await prisma.detail.findMany();
    console.log(`   ✓ Found ${details.length} detail records`);

    console.log('📦 Fetching test-tag relationships...');
    const testTags = await prisma.testTag.findMany();
    console.log(`   ✓ Found ${testTags.length} test-tag relationships`);

    // Create backup data object
    const backupData: BackupData = {
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      tests,
      evidence,
      details,
      tags,
      testTags
    };

    // Create backups directory if not exists
    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const backupFilename = `backup-${timestamp}.json`;
    const backupPath = path.join(backupDir, backupFilename);

    // Write backup file
    console.log('\n💾 Writing backup file...');
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
    console.log(`   ✓ Backup saved to: ${backupPath}`);

    // Also copy the database file
    const dbPath = path.join(__dirname, '../prisma/dev.db');
    const dbBackupPath = path.join(backupDir, `dev-${timestamp}.db`);
    
    if (fs.existsSync(dbPath)) {
      console.log('\n💾 Copying database file...');
      fs.copyFileSync(dbPath, dbBackupPath);
      console.log(`   ✓ Database copied to: ${dbBackupPath}`);
    }

    // Print summary
    console.log('\n✅ Backup completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Tests: ${tests.length}`);
    console.log(`   - Tags: ${tags.length}`);
    console.log(`   - Evidence: ${evidence.length}`);
    console.log(`   - Details: ${details.length}`);
    console.log(`   - Test-Tag relationships: ${testTags.length}`);
    console.log(`\n📁 Backup location: ${backupPath}`);
    console.log(`📁 Database backup: ${dbBackupPath}\n`);

    console.log('🚀 You can now safely run: npx prisma migrate dev\n');

  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

backupDatabase();
