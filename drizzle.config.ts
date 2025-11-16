import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// 尝试加载 .env.local 文件
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}

// 也尝试加载 .env 文件作为备用
dotenv.config();

// 验证 DATABASE_URL 是否存在
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL not found in environment variables.');
  console.error('');
  console.error('Please ensure your .env.local file contains:');
  console.error('DATABASE_URL=your_database_connection_string');
  console.error('');
  console.error('Get your DATABASE_URL from:');
  console.error('Supabase Dashboard > Settings > Database > Connection String');
  console.error('(Use Transaction Pooler mode)');
  process.exit(1);
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
