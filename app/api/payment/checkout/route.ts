import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { creemClient } from '@/lib/creem/client';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, lessonId } = body;

    if (!productId) {
      console.error('❌ No productId provided');
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Check if CREEM_API_KEY is configured
    if (!process.env.CREEM_API_KEY) {
      console.error('CREEM_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Payment system is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // For single course purchases, lessonId is required
    const singleCoursePid = process.env.NEXT_PUBLIC_SINGLE_COURSE_PID;
    if (productId === singleCoursePid && !lessonId) {
      console.error('❌ Lesson ID required for single course purchase');
      return NextResponse.json(
        { error: 'Lesson ID is required for single course purchase' },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const successUrl = `${siteUrl}/payment/success`;

    // Prepare metadata
    const metadata: Record<string, string> = {
      userId: user.id,
      productId,
    };

    // Add lessonId to metadata for single course purchases
    if (lessonId) {
      metadata.lessonId = lessonId;
    }

    // Create checkout session with Creem
    const checkout = await creemClient.createCheckout({
      product_id: productId,
      success_url: successUrl,
      metadata,
    });

    return NextResponse.json({
      checkoutUrl: checkout.checkout_url,
      checkoutId: checkout.id,
    });
  } catch (error) {
    console.error('Error creating checkout:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    );
  }
}

