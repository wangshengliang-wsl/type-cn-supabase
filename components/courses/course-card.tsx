'use client';

import { Lesson } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const FREE_LESSON_ID = 'greetings_l1';

interface CourseCardProps {
  lesson: Lesson;
  progress?: number; // 0-100
  canAccess?: boolean; // Whether user has access to this lesson
  hasLifetime?: boolean;
  hasSubscription?: boolean;
}

export function CourseCard({ 
  lesson, 
  progress = 0, 
  canAccess = false,
  hasLifetime = false,
  hasSubscription = false
}: CourseCardProps) {
  const router = useRouter();
  const [purchasing, setPurchasing] = useState(false);
  const isFree = lesson.lesson_id === FREE_LESSON_ID;
  const isLocked = !isFree && !canAccess;
  
  // 确保进度在0-100%之间
  const normalizedProgress = Math.max(0, Math.min(100, progress));
  
  const getAccessBadge = () => {
    if (isFree) {
      return <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 border-0">FREE</Badge>;
    }
    if (canAccess) {
      return <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 border-0">UNLOCKED</Badge>;
    }
    return <Badge className="bg-gray-500/10 text-gray-600 dark:text-gray-400 hover:bg-gray-500/20 border-0">PRO</Badge>;
  };

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: process.env.NEXT_PUBLIC_SINGLE_COURSE_PID,
          lessonId: lesson.lesson_id,
        }),
      });

      const data = await response.json();
      
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to start purchase. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      router.push('/dashboard/membership');
    }
  };

  return (
    <Card className="group overflow-hidden border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover-lift relative">
      <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <Image
          src={lesson.cover}
          alt={lesson.title_en}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 right-4">
          {getAccessBadge()}
        </div>
        <div className="absolute bottom-4 left-4">
          <Badge variant="secondary" className="bg-white/90 dark:bg-black/90 text-gray-900 dark:text-white border-0">
            {lesson.tag}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
          {lesson.title_en}
        </CardTitle>
        {lesson.title_zh && (
          <CardDescription className="text-base text-gray-600 dark:text-gray-400">
            {lesson.title_zh}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {lesson.description_en}
        </p>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500 dark:text-gray-500">Progress</span>
            <span className="font-semibold text-gray-900 dark:text-white">{normalizedProgress}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${normalizedProgress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-500 dark:text-gray-500">
            {lesson.items.length} items
          </span>
        </div>

        <Link 
          href={isLocked ? '#' : `/dashboard/lesson/${lesson.lesson_id}`} 
          className="block"
          onClick={handleCardClick}
        >
          <Button className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
            {isLocked ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Upgrade to Access
              </>
            ) : normalizedProgress > 0 ? (
              'Continue Learning'
            ) : (
              'Start Learning'
            )}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

