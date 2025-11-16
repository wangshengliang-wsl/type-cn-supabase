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
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Welcome back! 👋
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Continue your Chinese learning journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover-lift">
          <CardHeader className="pb-3">
            <CardDescription className="text-gray-500 dark:text-gray-500 text-sm">
              Days in a row
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              {stats.currentStreak} 🔥
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover-lift">
          <CardHeader className="pb-3">
            <CardDescription className="text-gray-500 dark:text-gray-500 text-sm">
              Total completed
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Lessons Done
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
              {stats.totalLessonsCompleted}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover-lift">
          <CardHeader className="pb-3">
            <CardDescription className="text-gray-500 dark:text-gray-500 text-sm">
              Study status today
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Today's Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">
              {todayStudied ? '✅' : '⏳'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-10 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Quick Actions
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-500">
            Start learning right away
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/courses" className="flex-1">
            <Button size="lg" className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100">
              Browse Courses
            </Button>
          </Link>
          <Link href="/dashboard/membership" className="flex-1">
            <Button size="lg" variant="outline" className="w-full border-gray-300 dark:border-gray-700">
              Upgrade Membership
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Progress */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Recent Progress
          </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-500">
            Your latest achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentProgress.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-500">
              Start your first lesson!
            </div>
          ) : (
            <div className="space-y-3">
              {recentProgress.map((progress) => {
                // 确保进度不超过100%
                const progressPercent = Math.min(100, Math.round(
                  (progress.completedItems / progress.totalItems) * 100
                ));
                return (
                  <Link
                    key={progress.lessonId}
                    href={`/dashboard/lesson/${progress.lessonId}`}
                    className="block group"
                  >
                    <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover-lift">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                            {progress.titleEn}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            {progress.titleZh}
                          </p>
                        </div>
                        <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-full">
                          {progress.tag}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Progress: {progress.completedItems}/{progress.totalItems} items
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {progressPercent}%
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
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

