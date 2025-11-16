import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { lessons, lessonItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;

    const lesson = await db
      .select()
      .from(lessons)
      .where(eq(lessons.lessonId, lessonId))
      .limit(1);

    if (lesson.length === 0) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    const items = await db
      .select()
      .from(lessonItems)
      .where(eq(lessonItems.lessonId, lessonId))
      .orderBy(lessonItems.order);

    const result = {
      lesson_id: lesson[0].lessonId,
      title_en: lesson[0].titleEn,
      title_zh: lesson[0].titleZh,
      description_en: lesson[0].descriptionEn,
      cover: lesson[0].cover,
      tag: lesson[0].tag,
      order: lesson[0].order,
      items: items.map((item) => ({
        item_id: item.itemId,
        type: item.type,
        en: item.en,
        zh: item.zh,
        py: item.py,
        accepted: item.accepted,
        audio: item.audio,
      })),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}

