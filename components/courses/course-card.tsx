'use client';

import { Lesson } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

interface CourseCardProps {
  lesson: Lesson;
  progress?: number; // 0-100
}

export function CourseCard({ lesson, progress = 0 }: CourseCardProps) {
  // 所有课程都是免费的
  const accessType = 'FREE';
  
  // 确保进度在0-100%之间
  const normalizedProgress = Math.max(0, Math.min(100, progress));
  
  const getAccessBadge = () => {
    switch (accessType) {
      case 'FREE':
        return <Badge className="bg-green-500 hover:bg-green-600">FREE</Badge>;
      case 'PRO':
        return <Badge className="bg-blue-500 hover:bg-blue-600">PRO</Badge>;
      case 'OWNED':
        return <Badge className="bg-purple-500 hover:bg-purple-600">OWNED</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
        <Image
          src={lesson.cover}
          alt={lesson.title_en}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute top-4 right-4">
          {getAccessBadge()}
        </div>
        <div className="absolute bottom-4 left-4">
          <Badge variant="secondary">{lesson.tag}</Badge>
        </div>
      </div>

      <CardHeader>
        <CardTitle>{lesson.title_en}</CardTitle>
        {lesson.title_zh && (
          <CardDescription className="text-lg">{lesson.title_zh}</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {lesson.description_en}
        </p>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{normalizedProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${normalizedProgress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {lesson.items.length} items
          </span>
        </div>

        <Link href={`/dashboard/lesson/${lesson.lesson_id}`}>
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            {normalizedProgress > 0 ? 'Continue Learning' : 'Start Learning'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

