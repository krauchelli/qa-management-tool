/**
 * One-time migration: reads all rows from local dev.db and inserts into Turso.
 * Run from backend/ directory: ts-node scripts/migrate-sqlite-to-turso.ts
 */
import { createClient } from '@libsql/client';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const DB_PATH = path.resolve(__dirname, '../prisma/dev.db');

const TABLES = [
  'Tag',
  'TestCase',
  'Test',
  'Detail',
  'Evidence',
  'TestTag',
  'TestCaseTag',
];

async function main() {
  const local = createClient({ url: `file:${DB_PATH}` });
  const remote = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log('Reading from:', DB_PATH);
  console.log('Writing to: ', process.env.TURSO_DATABASE_URL, '\n');

  for (const table of TABLES) {
    const { rows } = await local.execute(`SELECT * FROM "${table}"`);
    if (rows.length === 0) {
      console.log(`${table}: 0 rows — skipping`);
      continue;
    }

    const cols = Object.keys(rows[0]);
    const placeholders = cols.map(() => '?').join(', ');
    const sql = `INSERT OR IGNORE INTO "${table}" (${cols.map(c => `"${c}"`).join(', ')}) VALUES (${placeholders})`;

    let inserted = 0;
    let skipped = 0;
    for (const row of rows) {
      try {
        await remote.execute({ sql, args: cols.map(c => (row as any)[c]) });
        inserted++;
      } catch {
        skipped++;
      }
    }
    console.log(`${table}: ${inserted} inserted, ${skipped} skipped`);
  }

  console.log('\nMigration complete.');
  local.close();
  remote.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
