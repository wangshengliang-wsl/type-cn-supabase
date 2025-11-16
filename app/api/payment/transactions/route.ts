import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { transactions } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's transaction history
    const userTransactions = await db
      .select()
      .from(transactions)
      .where(sql`${transactions.userId}::text = ${user.id}`)
      .orderBy(desc(transactions.createdAt));

    return NextResponse.json({ transactions: userTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

