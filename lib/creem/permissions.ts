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
  const lifetimeProductId = process.env.NEXT_PUBLIC_LIFETIME_PRO_PID || '';
  const monthlyProductId = process.env.NEXT_PUBLIC_PRO_MEMBERSHIP_PID || '';
  const singleCourseProductId = process.env.NEXT_PUBLIC_SINGLE_COURSE_PID || '';
  
  console.log('🔍 Checking permissions for user:', userId);
  console.log('📦 Product IDs:', { lifetimeProductId, monthlyProductId, singleCourseProductId });
  
  const lifetimePurchase = await db
    .select()
    .from(userPurchases)
    .where(
      and(
        sql`${userPurchases.userId}::text = ${userId}`,
        eq(userPurchases.productId, lifetimeProductId),
        eq(userPurchases.status, 'paid')
      )
    )
    .limit(1);

  const hasLifetimeMembership = lifetimePurchase.length > 0;
  console.log('🎖️ Has lifetime membership:', hasLifetimeMembership);

  // Check for active subscription
  const activeSubscription = await db
    .select()
    .from(userSubscriptions)
    .where(
      and(
        sql`${userSubscriptions.userId}::text = ${userId}`,
        eq(userSubscriptions.productId, monthlyProductId),
        eq(userSubscriptions.status, 'active')
      )
    )
    .limit(1);

  const hasActiveSubscription = activeSubscription.length > 0;
  console.log('💳 Has active subscription:', hasActiveSubscription);

  // Get purchased individual lessons
  const purchases = await db
    .select()
    .from(userPurchases)
    .where(
      and(
        sql`${userPurchases.userId}::text = ${userId}`,
        eq(userPurchases.productId, singleCourseProductId),
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

