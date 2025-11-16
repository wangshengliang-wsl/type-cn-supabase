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
  if (productId === process.env.SINGLE_COURSE_PID) {
    return 'single_course';
  }
  if (productId === process.env.MONTHLY_PRO_PID) {
    return 'subscription';
  }
  if (productId === process.env.LIFETIME_PRO_PID) {
    return 'lifetime';
  }
  // Default fallback
  return 'single_course';
}

