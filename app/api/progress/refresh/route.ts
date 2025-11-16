import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userLessonProgress, userItemProgress, lessonItems, userStats } from '@/lib/db/schema';
import { createClient } from '@/lib/supabase/server';
import { eq, sql, and } from 'drizzle-orm';

// 刷新课程进度，确保进度计算准确
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lessonId } = body;

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
          totalItems: total,
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

    // 更新用户统计 - 确保 Lessons Completed 数据同步
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

    const existingStats = await db
      .select()
      .from(userStats)
      .where(sql`${userStats.userId}::text = ${user.id}`)
      .limit(1);

    const now = new Date();

    if (existingStats.length > 0) {
      await db
        .update(userStats)
        .set({
          totalLessonsCompleted: Number(totalLessonsCompleted[0].count),
          totalItemsCompleted: Number(totalItemsCompleted[0].count),
          updatedAt: now,
        })
        .where(eq(userStats.id, existingStats[0].id));
    } else {
      // 如果不存在统计记录，创建一个
      await db.insert(userStats).values({
        userId: user.id,
        totalLessonsCompleted: Number(totalLessonsCompleted[0].count),
        totalItemsCompleted: Number(totalItemsCompleted[0].count),
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: now,
      });
    }

    return NextResponse.json({ 
      success: true,
      completedItems: safeCompleted,
      totalItems: total,
      completed: isLessonCompleted,
    });
  } catch (error) {
    console.error('Error refreshing progress:', error);
    return NextResponse.json(
      { error: 'Failed to refresh progress' },
      { status: 500 }
    );
  }
}

