import { CourseList } from "@/components/courses/course-list";
import { db } from "@/lib/db";
import { lessons, lessonItems, userLessonProgress } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { getUserPermissions } from "@/lib/creem/permissions";
import { eq, sql } from "drizzle-orm";

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get user permissions
  let permissions = null;
  if (user) {
    permissions = await getUserPermissions(user.id);
  }

  // 获取所有课程
  const allLessons = await db
    .select()
    .from(lessons)
    .orderBy(lessons.order);

  // 获取每个课程的详细信息和进度
  const lessonsWithProgress = await Promise.all(
    allLessons.map(async (lesson) => {
      const items = await db
        .select()
        .from(lessonItems)
        .where(eq(lessonItems.lessonId, lesson.lessonId))
        .orderBy(lessonItems.order);

      let progress = 0;
      if (user) {
        const userProgress = await db
          .select()
          .from(userLessonProgress)
          .where(
            sql`${userLessonProgress.userId}::text = ${user.id} AND ${userLessonProgress.lessonId} = ${lesson.lessonId}`
          )
          .limit(1);

        if (userProgress.length > 0) {
          const prog = userProgress[0];
          // 确保进度不超过100%
          progress = Math.min(100, Math.round((prog.completedItems / prog.totalItems) * 100));
        }
      }

      const canAccess = permissions?.canAccessLesson(lesson.lessonId) || false;

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
          accepted: item.accepted as string[],
          audio: item.audio,
        })),
        progress,
        canAccess,
      };
    })
  );

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Course Store
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Browse and start learning from our curated courses
        </p>
      </div>

      <CourseList 
        lessons={lessonsWithProgress} 
        hasLifetime={permissions?.hasLifetimeMembership || false}
        hasSubscription={permissions?.hasActiveSubscription || false}
      />
    </div>
  );
}

