import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { userStats, userLessonProgress, lessons } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // 获取用户统计
  const statsResult = await db
    .select()
    .from(userStats)
    .where(sql`${userStats.userId}::text = ${user.id}`)
    .limit(1);

  const stats = statsResult.length > 0 ? statsResult[0] : {
    currentStreak: 0,
    totalLessonsCompleted: 0,
    totalItemsCompleted: 0,
    lastStudyDate: null,
  };

  // 检查今天是否学习过
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStudied = stats.lastStudyDate
    ? new Date(stats.lastStudyDate).setHours(0, 0, 0, 0) === today.getTime()
    : false;

  // 获取最近学习的课程
  const recentProgress = await db
    .select({
      lessonId: userLessonProgress.lessonId,
      completedItems: userLessonProgress.completedItems,
      totalItems: userLessonProgress.totalItems,
      completed: userLessonProgress.completed,
      lastStudiedAt: userLessonProgress.lastStudiedAt,
      titleEn: lessons.titleEn,
      titleZh: lessons.titleZh,
      tag: lessons.tag,
    })
    .from(userLessonProgress)
    .innerJoin(lessons, eq(userLessonProgress.lessonId, lessons.lessonId))
    .where(sql`${userLessonProgress.userId}::text = ${user.id}`)
    .orderBy(desc(userLessonProgress.lastStudiedAt))
    .limit(5);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Continue your Chinese learning journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Streak</CardTitle>
            <CardDescription>Days in a row</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">
              {stats.currentStreak} 🔥
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lessons Completed</CardTitle>
            <CardDescription>Total finished</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-600">
              {stats.totalLessonsCompleted}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Status</CardTitle>
            <CardDescription>Have you practiced?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {todayStudied ? '✅' : '⏳'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Start learning right away</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Link href="/dashboard/courses">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Browse Courses
            </Button>
          </Link>
          <Link href="/dashboard/membership">
            <Button size="lg" variant="outline">
              Upgrade to Premium
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Progress</CardTitle>
          <CardDescription>Your latest achievements</CardDescription>
        </CardHeader>
        <CardContent>
          {recentProgress.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Start your first lesson to see your progress here!
            </div>
          ) : (
            <div className="space-y-4">
              {recentProgress.map((progress) => {
                // 确保进度不超过100%
                const progressPercent = Math.min(100, Math.round(
                  (progress.completedItems / progress.totalItems) * 100
                ));
                return (
                  <Link
                    key={progress.lessonId}
                    href={`/dashboard/lesson/${progress.lessonId}`}
                    className="block"
                  >
                    <div className="p-4 rounded-lg border hover:border-blue-500 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {progress.titleEn}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {progress.titleZh}
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded">
                          {progress.tag}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Progress: {progress.completedItems}/{progress.totalItems} items
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {progressPercent}%
                          </span>
                        </div>
                        <Progress value={progressPercent} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

