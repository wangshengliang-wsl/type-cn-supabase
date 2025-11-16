import * as crypto from 'crypto';

/**
 * Verify Creem webhook signature
 */
export function verifyCreemSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return computedSignature === signature;
}

/**
 * Get product type from product ID
 */
export function getProductType(productId: string): 'single_course' | 'subscription' | 'lifetime' {
  const singleCoursePid = process.env.NEXT_PUBLIC_SINGLE_COURSE_PID;
  const monthlyProPid = process.env.NEXT_PUBLIC_PRO_MEMBERSHIP_PID;
  const lifetimeProPid = process.env.NEXT_PUBLIC_LIFETIME_PRO_PID;
  
  console.log('🔍 Determining product type:', {
    productId,
    singleCoursePid,
    monthlyProPid,
    lifetimeProPid,
  });
  
  if (productId === singleCoursePid) {
    console.log('✅ Product type: single_course');
    return 'single_course';
  }
  if (productId === monthlyProPid) {
    console.log('✅ Product type: subscription');
    return 'subscription';
  }
  if (productId === lifetimeProPid) {
    console.log('✅ Product type: lifetime');
    return 'lifetime';
  }
  
  // Default fallback - check billing_type from metadata if available
  console.warn('⚠️ Unknown product ID, defaulting to single_course');
  return 'single_course';
}

