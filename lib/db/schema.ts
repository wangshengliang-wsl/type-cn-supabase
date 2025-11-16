import { pgTable, uuid, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

// 课程表
export const lessons = pgTable('lessons', {
  id: uuid('id').primaryKey().defaultRandom(),
  lessonId: text('lesson_id').notNull().unique(), // 如 "greetings_l1"
  titleEn: text('title_en').notNull(),
  titleZh: text('title_zh').notNull(),
  descriptionEn: text('description_en').notNull(),
  cover: text('cover').notNull(),
  tag: text('tag').notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 课程项目表（单词/短语）
export const lessonItems = pgTable('lesson_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  itemId: text('item_id').notNull().unique(), // UUID from JSON
  lessonId: text('lesson_id').notNull(), // 外键到 lessons.lessonId
  type: text('type').notNull(), // 'word' or 'sentence'
  en: text('en').notNull(),
  zh: text('zh').notNull(),
  py: text('py').notNull(),
  accepted: jsonb('accepted').notNull(), // string[]
  audio: text('audio').notNull(),
  order: integer('order').notNull(), // 项目在课程中的顺序
  createdAt: timestamp('created_at').defaultNow(),
});

// 用户课程进度表
export const userLessonProgress = pgTable('user_lesson_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  lessonId: text('lesson_id').notNull(),
  completedItems: integer('completed_items').default(0),
  totalItems: integer('total_items').notNull(),
  completed: boolean('completed').default(false),
  lastStudiedAt: timestamp('last_studied_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 用户项目进度表（记录每个单词的学习情况）
export const userItemProgress = pgTable('user_item_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  itemId: text('item_id').notNull(),
  lessonId: text('lesson_id').notNull(),
  completed: boolean('completed').default(false),
  attempts: integer('attempts').default(0),
  correctAttempts: integer('correct_attempts').default(0),
  lastAttemptAt: timestamp('last_attempt_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 用户学习统计表
export const userStats = pgTable('user_stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(),
  totalLessonsCompleted: integer('total_lessons_completed').default(0),
  totalItemsCompleted: integer('total_items_completed').default(0),
  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  lastStudyDate: timestamp('last_study_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 导出类型
export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;
export type LessonItem = typeof lessonItems.$inferSelect;
export type NewLessonItem = typeof lessonItems.$inferInsert;
export type UserLessonProgress = typeof userLessonProgress.$inferSelect;
export type NewUserLessonProgress = typeof userLessonProgress.$inferInsert;
export type UserItemProgress = typeof userItemProgress.$inferSelect;
export type NewUserItemProgress = typeof userItemProgress.$inferInsert;
export type UserStats = typeof userStats.$inferSelect;
export type NewUserStats = typeof userStats.$inferInsert;
