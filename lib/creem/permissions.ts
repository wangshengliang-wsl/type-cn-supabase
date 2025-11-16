import { db } from '@/lib/db';
import { userSubscriptions, userPurchases } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

const FREE_LESSON_ID = 'greetings_l1';

export interface UserPermissions {
  hasLifetimeMembership: boolean;
  hasActiveSubscription: boolean;
  purchasedLessons: string[]; // Array of lessonIds
  canAccessLesson: (lessonId: string) => boolean;
}

/**
 * Get user's payment permissions
 */
export async function getUserPermissions(
  userId: string
): Promise<UserPermissions> {
  // Check for lifetime membership
  const lifetimePurchase = await db
    .select()
    .from(userPurchases)
    .where(
      and(
        sql`${userPurchases.userId}::text = ${userId}`,
        eq(userPurchases.productId, process.env.LIFETIME_PRO_PID || ''),
        eq(userPurchases.status, 'paid')
      )
    )
    .limit(1);

  const hasLifetimeMembership = lifetimePurchase.length > 0;

  // Check for active subscription
  const activeSubscription = await db
    .select()
    .from(userSubscriptions)
    .where(
      and(
        sql`${userSubscriptions.userId}::text = ${userId}`,
        eq(userSubscriptions.productId, process.env.MONTHLY_PRO_PID || ''),
        eq(userSubscriptions.status, 'active')
      )
    )
    .limit(1);

  const hasActiveSubscription = activeSubscription.length > 0;

  // Get purchased individual lessons
  const purchases = await db
    .select()
    .from(userPurchases)
    .where(
      and(
        sql`${userPurchases.userId}::text = ${userId}`,
        eq(userPurchases.productId, process.env.SINGLE_COURSE_PID || ''),
        eq(userPurchases.status, 'paid')
      )
    );

  const purchasedLessons = purchases
    .filter((p) => p.lessonId)
    .map((p) => p.lessonId as string);

  return {
    hasLifetimeMembership,
    hasActiveSubscription,
    purchasedLessons,
    canAccessLesson: (lessonId: string) => {
      // Free lesson
      if (lessonId === FREE_LESSON_ID) return true;
      
      // Lifetime or subscription unlocks all
      if (hasLifetimeMembership || hasActiveSubscription) return true;
      
      // Check individual purchase
      return purchasedLessons.includes(lessonId);
    },
  };
}

/**
 * Check if user can access a specific lesson
 */
export async function canUserAccessLesson(
  userId: string,
  lessonId: string
): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  return permissions.canAccessLesson(lessonId);
}

