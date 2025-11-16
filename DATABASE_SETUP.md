# 数据库设置指南

## 📋 前置要求

确保你的 `.env.local` 文件包含以下环境变量：

```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_anon_key

# 数据库连接字符串
DATABASE_URL=your_database_connection_string
```

你可以在 Supabase 项目的 Settings > Database > Connection String 中找到 `DATABASE_URL`（选择 Transaction Pooler 模式）。

## 🚀 设置步骤

### 1. 生成并应用数据库迁移

首先生成迁移文件：

```bash
pnpm db:generate
```

然后应用迁移到数据库：

```bash
pnpm db:migrate
```

这将创建以下表：
- `lessons` - 课程表
- `lesson_items` - 课程项目表（单词/短语）
- `user_lesson_progress` - 用户课程进度表
- `user_item_progress` - 用户项目进度表
- `user_stats` - 用户学习统计表

### 2. 导入课程数据

运行种子脚本将 `lessons.json` 中的数据导入数据库：

```bash
pnpm db:seed
```

这将导入：
- 4个课程（Basic Greetings, Casual Conversation, Ordering Basics, Dining Requests）
- 40个学习项目（单词和短语）

### 3. 验证数据

你可以使用 Drizzle Studio 查看数据库内容：

```bash
pnpm db:studio
```

或者登录到 Supabase Dashboard > Table Editor 查看表和数据。

## 📊 数据库结构

### lessons
- `lesson_id` - 课程唯一标识符（如 "greetings_l1"）
- `title_en` - 英文标题
- `title_zh` - 中文标题
- `description_en` - 课程描述
- `cover` - 封面图片URL
- `tag` - 分类标签（Greeting, Conversation, Food等）
- `order` - 显示顺序

### lesson_items
- `item_id` - 项目唯一标识符
- `lesson_id` - 所属课程
- `type` - 类型（word/sentence）
- `en` - 英文提示
- `zh` - 中文答案
- `py` - 拼音
- `accepted` - 可接受的拼音输入格式（JSON数组）
- `audio` - 音频URL
- `order` - 在课程中的顺序

### user_lesson_progress
- `user_id` - 用户ID（来自Supabase Auth）
- `lesson_id` - 课程ID
- `completed_items` - 已完成项目数
- `total_items` - 总项目数
- `completed` - 课程是否完成
- `last_studied_at` - 最后学习时间

### user_item_progress
- `user_id` - 用户ID
- `item_id` - 项目ID
- `lesson_id` - 课程ID
- `completed` - 是否完成
- `attempts` - 尝试次数
- `correct_attempts` - 正确次数
- `last_attempt_at` - 最后尝试时间

### user_stats
- `user_id` - 用户ID
- `total_lessons_completed` - 完成的课程总数
- `total_items_completed` - 完成的项目总数
- `current_streak` - 当前连续学习天数
- `longest_streak` - 最长连续学习天数
- `last_study_date` - 最后学习日期

## 🔄 重新导入数据

如果需要重新导入课程数据，种子脚本会自动清空现有课程数据（不会影响用户进度），然后重新导入。

```bash
pnpm db:seed
```

## 🔧 常用命令

```bash
# 生成新的迁移文件（修改schema后）
pnpm db:generate

# 应用迁移到数据库
pnpm db:migrate

# 导入课程数据
pnpm db:seed

# 打开Drizzle Studio可视化工具
pnpm db:studio
```

## ⚠️ 注意事项

1. **用户进度不会被清除** - 种子脚本只清除 `lessons` 和 `lesson_items` 表
2. **生产环境** - 在生产环境中谨慎使用 `db:seed`，建议只在初始化时运行一次
3. **备份数据** - 在重新运行种子脚本前，建议先备份数据库
4. **环境变量** - 确保 `.env.local` 文件包含正确的 `DATABASE_URL`

## 🎯 API端点

应用已实现以下API端点：

- `GET /api/lessons` - 获取所有课程（包含用户进度）
- `GET /api/lessons/[lessonId]` - 获取单个课程详情
- `POST /api/progress` - 保存学习进度
- `GET /api/progress` - 获取用户统计数据

## ✅ 完成！

设置完成后，你的应用将：
- ✅ 从数据库加载课程数据
- ✅ 实时保存学习进度
- ✅ 显示准确的统计信息
- ✅ 跟踪连续学习天数

