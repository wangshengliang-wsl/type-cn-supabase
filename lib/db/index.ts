import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

// 加载 .env.local 文件（如果还没有加载的话）
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: '.env.local' });
}

// 从环境变量获取数据库URL
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set. Please check your .env.local file.');
}

// 创建postgres连接
const client = postgres(connectionString);

// 创建drizzle实例
export const db = drizzle(client);

// 导出类型
export type Database = typeof db;
