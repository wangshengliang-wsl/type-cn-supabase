import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userLessonProgress, userItemProgress, userStats, lessonItems } from '@/lib/db/schema';
import { createClient } from '@/lib/supabase/server';
import { eq, sql, and } from 'drizzle-orm';

// 保存课程进度
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lessonId, itemId, correct } = body;

    // 更新项目进度
    const existingItemProgress = await db
      .select()
      .from(userItemProgress)
      .where(
        and(
          sql`${userItemProgress.userId}::text = ${user.id}`,
          eq(userItemProgress.itemId, itemId)
        )
      )
      .limit(1);

    if (existingItemProgress.length > 0) {
      // 更新现有进度
      await db
        .update(userItemProgress)
        .set({
          attempts: sql`${userItemProgress.attempts} + 1`,
          correctAttempts: correct
            ? sql`${userItemProgress.correctAttempts} + 1`
            : userItemProgress.correctAttempts,
          completed: correct ? true : existingItemProgress[0].completed,
          lastAttemptAt: new Date(),
        })
        .where(eq(userItemProgress.id, existingItemProgress[0].id));
    } else {
      // 创建新进度记录
      await db.insert(userItemProgress).values({
        userId: user.id,
        itemId,
        lessonId,
        attempts: 1,
        correctAttempts: correct ? 1 : 0,
        completed: correct,
        lastAttemptAt: new Date(),
      });
    }

    // 获取课程总项目数
    const totalItems = await db
      .select({ count: sql<number>`count(*)` })
      .from(lessonItems)
      .where(eq(lessonItems.lessonId, lessonId));

    // 获取已完成的项目数
    const completedItems = await db
      .select({ count: sql<number>`count(*)` })
      .from(userItemProgress)
      .where(
        and(
          sql`${userItemProgress.userId}::text = ${user.id}`,
          eq(userItemProgress.lessonId, lessonId),
          eq(userItemProgress.completed, true)
        )
      );

    const total = Number(totalItems[0].count);
    const completed = Number(completedItems[0].count);
    
    // 确保completedItems不超过totalItems
    const safeCompleted = Math.min(completed, total);
    const isLessonCompleted = safeCompleted === total;

    // 更新课程进度
    const existingLessonProgress = await db
      .select()
      .from(userLessonProgress)
      .where(
        and(
          sql`${userLessonProgress.userId}::text = ${user.id}`,
          eq(userLessonProgress.lessonId, lessonId)
        )
      )
      .limit(1);

    if (existingLessonProgress.length > 0) {
      await db
        .update(userLessonProgress)
        .set({
          completedItems: safeCompleted,
          totalItems: total, // 始终更新totalItems，确保数据一致
          completed: isLessonCompleted,
          lastStudiedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(userLessonProgress.id, existingLessonProgress[0].id));
    } else {
      await db.insert(userLessonProgress).values({
        userId: user.id,
        lessonId,
        completedItems: safeCompleted,
        totalItems: total,
        completed: isLessonCompleted,
        lastStudiedAt: new Date(),
      });
    }

    // 更新用户统计
    const existingStats = await db
      .select()
      .from(userStats)
      .where(sql`${userStats.userId}::text = ${user.id}`)
      .limit(1);

    const totalLessonsCompleted = await db
      .select({ count: sql<number>`count(*)` })
      .from(userLessonProgress)
      .where(
        and(
          sql`${userLessonProgress.userId}::text = ${user.id}`,
          eq(userLessonProgress.completed, true)
        )
      );

    const totalItemsCompleted = await db
      .select({ count: sql<number>`count(*)` })
      .from(userItemProgress)
      .where(
        and(
          sql`${userItemProgress.userId}::text = ${user.id}`,
          eq(userItemProgress.completed, true)
        )
      );

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (existingStats.length > 0) {
      const lastStudy = existingStats[0].lastStudyDate;
      let newStreak = existingStats[0].currentStreak;

      if (lastStudy) {
        const lastStudyDate = new Date(
          lastStudy.getFullYear(),
          lastStudy.getMonth(),
          lastStudy.getDate()
        );
        const daysDiff = Math.floor(
          (today.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDiff === 0) {
          // 今天已经学习过
          newStreak = existingStats[0].currentStreak;
        } else if (daysDiff === 1) {
          // 连续学习
          newStreak = existingStats[0].currentStreak + 1;
        } else {
          // 中断了
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      await db
        .update(userStats)
        .set({
          totalLessonsCompleted: Number(totalLessonsCompleted[0].count),
          totalItemsCompleted: Number(totalItemsCompleted[0].count),
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, existingStats[0].longestStreak),
          lastStudyDate: now,
          updatedAt: now,
        })
        .where(eq(userStats.id, existingStats[0].id));
    } else {
      await db.insert(userStats).values({
        userId: user.id,
        totalLessonsCompleted: Number(totalLessonsCompleted[0].count),
        totalItemsCompleted: Number(totalItemsCompleted[0].count),
        currentStreak: 1,
        longestStreak: 1,
        lastStudyDate: now,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}

// 获取用户统计
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await db
      .select()
      .from(userStats)
      .where(sql`${userStats.userId}::text = ${user.id}`)
      .limit(1);

    if (stats.length === 0) {
      return NextResponse.json({
        totalLessonsCompleted: 0,
        totalItemsCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: null,
      });
    }

    return NextResponse.json(stats[0]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

