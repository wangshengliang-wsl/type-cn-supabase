import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  transactions,
  userSubscriptions,
  userPurchases,
} from '@/lib/db/schema';
import { verifyCreemSignature, getProductType } from '@/lib/creem/webhook';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('creem-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 401 }
      );
    }

    // Verify signature
    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET || '';
    if (!verifyCreemSignature(body, signature, webhookSecret)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const payload = JSON.parse(body);
    const { eventType, object } = payload;

    console.log(`Received webhook: ${eventType}`, object);

    // Handle different event types
    switch (eventType) {
      case 'checkout.completed':
        await handleCheckoutCompleted(object);
        break;

      case 'subscription.active':
      case 'subscription.paid':
        await handleSubscriptionActive(object);
        break;

      case 'subscription.canceled':
      case 'subscription.expired':
        await handleSubscriptionCanceled(object);
        break;

      case 'refund.created':
        await handleRefundCreated(object);
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(data: any) {
  const { id: checkoutId, order, product, subscription, metadata } = data;

  // Extract user ID from metadata
  const userId = metadata?.userId;
  if (!userId) {
    console.error('No userId in metadata');
    return;
  }

  const productId = metadata?.productId || product?.id || '';
  const productType = getProductType(productId);

  // Create transaction record
  await db.insert(transactions).values({
    userId,
    transactionId: order?.transaction || checkoutId,
    checkoutId,
    orderId: order?.id || null,
    subscriptionId: subscription?.id || null,
    productId,
    type: productType,
    amount: order?.amount || 0,
    currency: order?.currency || 'USD',
    status: 'completed',
    metadata,
  });

  // Handle based on product type
  if (productType === 'subscription' && subscription) {
    // Create or update subscription record
    const existing = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.subscriptionId, subscription.id))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(userSubscriptions)
        .set({
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start_date),
          currentPeriodEnd: new Date(subscription.current_period_end_date),
          updatedAt: new Date(),
        })
        .where(eq(userSubscriptions.subscriptionId, subscription.id));
    } else {
      await db.insert(userSubscriptions).values({
        userId,
        subscriptionId: subscription.id,
        productId,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start_date),
        currentPeriodEnd: new Date(subscription.current_period_end_date),
      });
    }
  } else {
    // Single course or lifetime purchase
    await db.insert(userPurchases).values({
      userId,
      orderId: order?.id || checkoutId,
      productId,
      lessonId: metadata?.lessonId || null,
      amount: order?.amount || 0,
      currency: order?.currency || 'USD',
      status: 'paid',
    });
  }
}

async function handleSubscriptionActive(data: any) {
  const { id: subscriptionId, product, customer, status } = data;
  const productId = product?.id || '';

  // Find existing subscription
  const existing = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.subscriptionId, subscriptionId))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(userSubscriptions)
      .set({
        status,
        currentPeriodStart: data.current_period_start_date
          ? new Date(data.current_period_start_date)
          : undefined,
        currentPeriodEnd: data.current_period_end_date
          ? new Date(data.current_period_end_date)
          : undefined,
        updatedAt: new Date(),
      })
      .where(eq(userSubscriptions.subscriptionId, subscriptionId));
  }
}

async function handleSubscriptionCanceled(data: any) {
  const { id: subscriptionId, status, canceled_at } = data;

  await db
    .update(userSubscriptions)
    .set({
      status,
      canceledAt: canceled_at ? new Date(canceled_at) : new Date(),
      updatedAt: new Date(),
    })
    .where(eq(userSubscriptions.subscriptionId, subscriptionId));
}

async function handleRefundCreated(data: any) {
  const { transaction, order } = data;

  if (transaction?.id) {
    // Update transaction status
    await db
      .update(transactions)
      .set({
        status: 'refunded',
      })
      .where(eq(transactions.transactionId, transaction.id));
  }

  if (order?.id) {
    // Update purchase status
    await db
      .update(userPurchases)
      .set({
        status: 'refunded',
      })
      .where(eq(userPurchases.orderId, order.id));
  }
}

