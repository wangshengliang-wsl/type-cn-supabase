import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // TODO: Fetch user stats and recent progress from database
  const userStats = {
    currentStreak: 0,
    totalCompleted: 0,
    todayStudied: false,
  };

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
              {userStats.currentStreak} 🔥
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Completed</CardTitle>
            <CardDescription>Lessons finished</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-600">
              {userStats.totalCompleted}
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
              {userStats.todayStudied ? '✅' : '⏳'}
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

      {/* Recent Progress - Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Progress</CardTitle>
          <CardDescription>Your latest achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Start your first lesson to see your progress here!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

