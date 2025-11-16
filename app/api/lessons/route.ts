import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { lessons, lessonItems, userLessonProgress } from '@/lib/db/schema';
import { createClient } from '@/lib/supabase/server';
import { eq, sql } from 'drizzle-orm';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 获取所有课程
    const allLessons = await db
      .select()
      .from(lessons)
      .orderBy(lessons.order);

    // 获取每个课程的项目数量
    const lessonsWithItems = await Promise.all(
      allLessons.map(async (lesson) => {
        const items = await db
          .select()
          .from(lessonItems)
          .where(eq(lessonItems.lessonId, lesson.lessonId))
          .orderBy(lessonItems.order);

        // 如果用户已登录，获取进度
        let progress = 0;
        if (user) {
          const userProgress = await db
            .select()
            .from(userLessonProgress)
            .where(
              sql`${userLessonProgress.userId} = ${user.id} AND ${userLessonProgress.lessonId} = ${lesson.lessonId}`
            )
            .limit(1);

          if (userProgress.length > 0) {
            const prog = userProgress[0];
            progress = Math.round((prog.completedItems / prog.totalItems) * 100);
          }
        }

        return {
          lesson_id: lesson.lessonId,
          title_en: lesson.titleEn,
          title_zh: lesson.titleZh,
          description_en: lesson.descriptionEn,
          cover: lesson.cover,
          tag: lesson.tag,
          order: lesson.order,
          items: items.map((item) => ({
            item_id: item.itemId,
            type: item.type,
            en: item.en,
            zh: item.zh,
            py: item.py,
            accepted: item.accepted,
            audio: item.audio,
          })),
          progress,
        };
      })
    );

    return NextResponse.json(lessonsWithItems);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}

