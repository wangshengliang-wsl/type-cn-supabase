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
    const { checkoutId } = body;

    if (!checkoutId) {
      return NextResponse.json(
        { error: 'Checkout ID is required' },
        { status: 400 }
      );
    }

    // Get checkout status from Creem
    const checkout = await creemClient.getCheckout(checkoutId);

    return NextResponse.json({
      status: checkout.status,
      completed: checkout.status === 'completed',
      order: checkout.order,
      subscription: checkout.subscription,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}

