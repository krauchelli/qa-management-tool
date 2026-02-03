import prisma from '../src/utils/prisma';

const defaultTags = [
  // Test Types
  { name: 'regression', color: '#EF4444', category: 'test-type' },
  { name: 'positive-case', color: '#10B981', category: 'test-type' },
  { name: 'negative-case', color: '#F59E0B', category: 'test-type' },
  { name: 'edge-case', color: '#8B5CF6', category: 'test-type' },
  
  // Priority
  { name: 'critical', color: '#DC2626', category: 'priority' },
  { name: 'high', color: '#F59E0B', category: 'priority' },
  { name: 'medium', color: '#3B82F6', category: 'priority' },
  { name: 'low', color: '#6B7280', category: 'priority' },
  
  // Feature Areas (examples)
  { name: 'authentication', color: '#06B6D4', category: 'feature' },
  { name: 'api', color: '#8B5CF6', category: 'feature' },
  { name: 'ui', color: '#EC4899', category: 'feature' },
  { name: 'database', color: '#14B8A6', category: 'feature' },
];

async function seedTags() {
  console.log('🌱 Seeding default tags...');
  
  for (const tag of defaultTags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    });
  }
  
  console.log(`✅ Seeded ${defaultTags.length} tags`);
}

seedTags()
  .catch((error) => {
    console.error('❌ Error seeding tags:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
