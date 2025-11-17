'use client';

import { useEffect, useState } from 'react';
import { CourseList } from '@/components/courses/course-list';

import type { Lesson } from '@/lib/types';

export default function CoursesPage() {
  const [lessonsWithProgress, setLessonsWithProgress] = useState<(Lesson & { progress?: number; canAccess?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/lessons');
      const data = await response.json();
      setLessonsWithProgress(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    
    // 监听权限更新事件
    const handlePermissionsUpdated = () => {
      fetchCourses();
    };
    
    window.addEventListener('permissionsUpdated', handlePermissionsUpdated);
    
    return () => {
      window.removeEventListener('permissionsUpdated', handlePermissionsUpdated);
    };
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-8 max-w-7xl">
        <div className="text-center py-12">
          <div className="mx-auto mb-4 w-16 h-16 border-4 border-gray-200 dark:border-gray-800 border-t-black dark:border-t-white rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-500">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          课程商店
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          浏览并开始学习我们精心准备的课程
        </p>
      </div>
      <CourseList lessons={lessonsWithProgress} />
    </div>
  );
}
