import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { lessons, lessonItems, userLessonProgress, userSubscriptions, userPurchases } from '@/lib/db/schema';
import { eq, sql, and } from 'drizzle-orm';

const FREE_LESSON_ID = 'greetings_l1';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 获取所有课程和项目
    const allLessons = await db
      .select({
        lesson: lessons,
        items: sql<Array<{
          id: string;
          itemId: string;
          lessonId: string;
          type: string;
          en: string;
          zh: string;
          py: string;
          accepted: string[];
          audio: string;
          order: number;
        }>>`json_agg(${lessonItems}.* ORDER BY ${lessonItems.order})`,
      })
      .from(lessons)
      .leftJoin(lessonItems, eq(lessons.lessonId, lessonItems.lessonId))
      .groupBy(lessons.id)
      .orderBy(lessons.order);

    // 获取用户进度
          const userProgress = await db
            .select()
            .from(userLessonProgress)
      .where(sql`${userLessonProgress.userId}::text = ${user.id}`);

    // 获取用户订阅
    const subscriptions = await db
      .select()
      .from(userSubscriptions)
      .where(
        and(
          sql`${userSubscriptions.userId}::text = ${user.id}`,
          eq(userSubscriptions.status, 'active')
        )
      );

    // 获取用户购买记录（包括终身会员和单课程）
    const purchases = await db
      .select()
      .from(userPurchases)
            .where(
        and(
          sql`${userPurchases.userId}::text = ${user.id}`,
          eq(userPurchases.status, 'paid')
        )
      );

    // 判断用户是否有终身会员
    const hasLifetime = purchases.some(
      (p) => p.productId === process.env.NEXT_PUBLIC_LIFETIME_PRO_PID
    );

    // 判断用户是否有活跃订阅
    const hasSubscription = subscriptions.length > 0;

    // 构建响应数据
    const lessonsWithProgress = allLessons.map((row) => {
      const lessonData = row.lesson;
      const items = row.items || [];
      const progress = userProgress.find((p) => p.lessonId === lessonData.lessonId);

      // 判断用户是否可以访问该课程
      const isFree = lessonData.lessonId === FREE_LESSON_ID;
      const hasPurchased = purchases.some((p) => p.lessonId === lessonData.lessonId);
      const canAccess = isFree || hasLifetime || hasSubscription || hasPurchased;

        return {
        lesson_id: lessonData.lessonId,
        title_en: lessonData.titleEn,
        title_zh: lessonData.titleZh,
        description_en: lessonData.descriptionEn,
        cover: lessonData.cover,
        tag: lessonData.tag,
        order: lessonData.order,
        items: (items as Array<{
          itemId: string;
          type: string;
          en: string;
          zh: string;
          py: string;
          accepted: string[];
          audio: string;
        }>).map((item) => ({
            item_id: item.itemId,
            type: item.type,
            en: item.en,
            zh: item.zh,
            py: item.py,
            accepted: item.accepted,
            audio: item.audio,
          })),
        progress: progress && progress.completedItems !== null && progress.totalItems > 0 
          ? (progress.completedItems / progress.totalItems) * 100 
          : 0,
        canAccess,
        hasLifetime,
        hasSubscription,
        };
    });

    return NextResponse.json(lessonsWithProgress);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}
