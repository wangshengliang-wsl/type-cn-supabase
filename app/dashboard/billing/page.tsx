'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  id: string;
  transactionId: string;
  productId: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export default function BillingPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/payment/transactions');
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getProductName = (type: string, metadata: Record<string, unknown>) => {
    if (type === 'single_course') {
      return `Single Course${metadata?.lessonId ? ` (${metadata.lessonId})` : ''}`;
    }
    if (type === 'subscription') {
      return 'Pro Monthly Subscription';
    }
    if (type === 'lifetime') {
      return 'Lifetime Pro Membership';
    }
    return 'Unknown Product';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-0">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-0">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-0">Failed</Badge>;
      case 'refunded':
        return <Badge className="bg-gray-500/10 text-gray-600 dark:text-gray-400 border-0">Refunded</Badge>;
      default:
        return <Badge className="bg-gray-500/10 text-gray-600 dark:text-gray-400 border-0">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 max-w-7xl">
        <div className="text-center py-12">
          <div className="mx-auto mb-4 w-16 h-16 border-4 border-gray-200 dark:border-gray-800 border-t-black dark:border-t-white rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-500">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Billing History
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          View your payment history and transactions
        </p>
      </div>

      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All your purchases and subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-500">
              No transactions yet
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {getProductName(transaction.type, transaction.metadata)}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatAmount(transaction.amount, transaction.currency)}
                        </div>
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                    <span>Transaction ID: {transaction.transactionId}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

