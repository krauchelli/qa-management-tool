import { createClient } from '@libsql/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MIGRATIONS_DIR = path.resolve(__dirname, '../prisma/migrations');

function splitStatements(sql: string): string[] {
  return sql
    .split(';')
    .map(s => s.replace(/^(\s*--[^\n]*\n)+/gm, '').trim())
    .filter(s => s.length > 0);
}

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.error('TURSO_DATABASE_URL not set');
    process.exit(1);
  }

  const client = createClient({ url, authToken });

  const migrationDirs = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter(d => fs.statSync(path.join(MIGRATIONS_DIR, d)).isDirectory())
    .sort();

  for (const dir of migrationDirs) {
    const sqlFile = path.join(MIGRATIONS_DIR, dir, 'migration.sql');
    if (!fs.existsSync(sqlFile)) continue;

    console.log(`Applying: ${dir}`);
    const sql = fs.readFileSync(sqlFile, 'utf8');
    const statements = splitStatements(sql);

    for (const stmt of statements) {
      try {
        await client.execute(stmt);
      } catch (err: any) {
        if (err.message?.includes('already exists') || err.message?.includes('duplicate')) {
          console.log(`  skipped (already exists): ${stmt.substring(0, 60)}...`);
        } else {
          console.error(`  error on: ${stmt.substring(0, 80)}`);
          console.error(`  ${err.message}`);
        }
      }
    }
  }

  console.log('\nDone — Turso schema is ready.');
  client.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
