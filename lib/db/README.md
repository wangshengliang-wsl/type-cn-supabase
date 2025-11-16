# Drizzle ORM 配置

这个项目已经配置了 Drizzle ORM 用于数据库操作。

## 配置文件

- `drizzle.config.ts` - Drizzle Kit 配置文件
- `lib/db/index.ts` - 数据库连接配置
- `lib/db/schema.ts` - 数据表结构定义
- `lib/db/example.ts` - 使用示例

## 环境变量

确保在 `.env.local` 文件中设置了以下环境变量：

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

## 可用脚本

```bash
# 生成迁移文件
pnpm run db:generate

# 执行迁移
pnpm run db:migrate

# 推送schema到数据库（开发环境）
pnpm run db:push

# 启动Drizzle Studio（数据库管理界面）
pnpm run db:studio
```

## 使用方法

1. 在 `lib/db/schema.ts` 中定义你的数据表结构
2. 运行 `pnpm run db:generate` 生成迁移文件
3. 运行 `pnpm run db:push` 或 `pnpm run db:migrate` 应用到数据库
4. 在你的组件中导入 `db` 实例进行数据库操作

```typescript
import { db } from '@/lib/db';

// 在你的API路由或服务器组件中使用
const data = await db.select().from(yourTable);
```

## 注意事项

- 确保 `DATABASE_URL` 环境变量正确配置
- 在生产环境中使用迁移而不是 `db:push`
- 查看 `lib/db/example.ts` 了解更多使用示例