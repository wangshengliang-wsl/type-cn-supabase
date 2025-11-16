import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// 加载 .env.local 文件
dotenv.config({ path: '.env.local' });

async function runMigrate() {
  console.log('⏳ Running migrations...');

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);

  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  await sql.end();
  process.exit(0);
}

runMigrate();

