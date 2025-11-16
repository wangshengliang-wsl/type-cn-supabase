import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// 从环境变量获取数据库URL
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// 创建postgres连接
const client = postgres(connectionString);

// 创建drizzle实例
export const db = drizzle(client);

// 导出类型
export type Database = typeof db;