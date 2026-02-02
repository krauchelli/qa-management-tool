import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyImport() {
  console.log('🔍 Verifying imported data...\n');
  
  // Count tests
  const totalTests = await prisma.test.count();
  const passedTests = await prisma.test.count({ where: { status: 'PASSED' } });
  const failedTests = await prisma.test.count({ where: { status: 'FAILED' } });
  const inProgressTests = await prisma.test.count({ where: { status: 'IN_PROGRESS' } });
  const blockedTests = await prisma.test.count({ where: { status: 'BLOCKED' } });
  
  console.log('📊 Test Statistics:');
  console.log(`  Total Tests: ${totalTests}`);
  console.log(`  ✅ Passed: ${passedTests}`);
  console.log(`  🔴 Failed: ${failedTests}`);
  console.log(`  🟡 In Progress: ${inProgressTests}`);
  console.log(`  ❌ Blocked: ${blockedTests}\n`);
  
  // Count by environment
  const devTests = await prisma.test.count({ where: { env: 'DEV' } });
  const stagingTests = await prisma.test.count({ where: { env: 'STAGING' } });
  const prodTests = await prisma.test.count({ where: { env: 'PROD' } });
  
  console.log('🌍 By Environment:');
  console.log(`  DEV: ${devTests}`);
  console.log(`  STAGING: ${stagingTests}`);
  console.log(`  PROD: ${prodTests}\n`);
  
  // Count evidence
  const totalEvidence = await prisma.evidence.count();
  console.log(`📎 Total Evidence: ${totalEvidence}\n`);
  
  // Count details
  const totalDetails = await prisma.detail.count();
  console.log(`📝 Total Details: ${totalDetails}\n`);
  
  // Show recent tests
  const recentTests = await prisma.test.findMany({
    take: 5,
    orderBy: { date: 'desc' },
    include: {
      evidence: true,
      detail: true,
    },
  });
  
  console.log('📋 Recent Tests:');
  recentTests.forEach((test, index) => {
    const statusEmoji = 
      test.status === 'PASSED' ? '✅' :
      test.status === 'FAILED' ? '🔴' :
      test.status === 'IN_PROGRESS' ? '🟡' : '❌';
    
    console.log(`  ${index + 1}. ${statusEmoji} ${test.feature} (${test.date})`);
    console.log(`     Env: ${test.env} | Jira: ${test.jira || 'N/A'}`);
    console.log(`     Evidence: ${test.evidence.length} | Details: ${test.detail ? '✓' : '✗'}`);
  });
  
  console.log('\n✅ Verification complete!');
}

verifyImport()
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
