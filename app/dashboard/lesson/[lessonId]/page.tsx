import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/lesson/lesson-player";
import lessonsData from "@/docs/lessons.json";

interface LessonPageProps {
  params: Promise<{
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const lesson = lessonsData.find((l) => l.lesson_id === lessonId);

  if (!lesson) {
    notFound();
  }

  return <LessonPlayer lesson={lesson} />;
}

