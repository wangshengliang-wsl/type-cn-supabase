'use client';

import { useState } from 'react';
import { Lesson, LessonTag } from '@/lib/types';
import { CourseCard } from './course-card';
import { Badge } from '@/components/ui/badge';

interface CourseListProps {
  lessons: (Lesson & { canAccess?: boolean; hasLifetime?: boolean; hasSubscription?: boolean })[];
}

export function CourseList({ lessons }: CourseListProps) {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  // Extract unique tags
  const allTags = Array.from(new Set(lessons.map(lesson => lesson.tag)));

  const toggleTag = (tag: string) => {
    const newSelectedTags = new Set(selectedTags);
    if (newSelectedTags.has(tag)) {
      newSelectedTags.delete(tag);
    } else {
      newSelectedTags.add(tag);
    }
    setSelectedTags(newSelectedTags);
  };

  // Filter lessons based on selected tags
  const filteredLessons = selectedTags.size === 0
    ? lessons
    : lessons.filter(lesson => selectedTags.has(lesson.tag));

  return (
    <div>
      {/* Tag Filter */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filter by Category
        </h2>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedTags.size === 0 ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setSelectedTags(new Set())}
          >
            All
          </Badge>
          {allTags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.has(tag) ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map(lesson => (
          <CourseCard 
            key={lesson.lesson_id} 
            lesson={lesson} 
            progress={lesson.progress || 0}
            canAccess={lesson.canAccess || false}
            hasLifetime={lesson.hasLifetime || false}
            hasSubscription={lesson.hasSubscription || false}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No courses found for the selected filters.
          </p>
        </div>
      )}
    </div>
  );
}

