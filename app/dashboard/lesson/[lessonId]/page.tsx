import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/lesson/lesson-player";
import { db } from "@/lib/db";
import { lessons, lessonItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface LessonPageProps {
  params: Promise<{
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;

  const lessonResult = await db
    .select()
    .from(lessons)
    .where(eq(lessons.lessonId, lessonId))
    .limit(1);

  if (lessonResult.length === 0) {
    notFound();
  }

  const items = await db
    .select()
    .from(lessonItems)
    .where(eq(lessonItems.lessonId, lessonId))
    .orderBy(lessonItems.order);

  const lesson = {
    lesson_id: lessonResult[0].lessonId,
    title_en: lessonResult[0].titleEn,
    title_zh: lessonResult[0].titleZh,
    description_en: lessonResult[0].descriptionEn,
    cover: lessonResult[0].cover,
    tag: lessonResult[0].tag,
    order: lessonResult[0].order,
    items: items.map((item) => ({
      item_id: item.itemId,
      type: item.type,
      en: item.en,
      zh: item.zh,
      py: item.py,
      accepted: item.accepted as string[],
      audio: item.audio,
    })),
  };

  return <LessonPlayer lesson={lesson} />;
}

