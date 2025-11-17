'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UserPermissions {
  hasLifetimeMembership: boolean;
  hasActiveSubscription: boolean;
  subscriptionPeriodStart?: string | null;
  subscriptionPeriodEnd?: string | null;
}

export default function MembershipPage() {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermissions();
    
    // 监听权限更新事件
    const handlePermissionsUpdated = () => {
      fetchPermissions();
    };
    
    window.addEventListener('permissionsUpdated', handlePermissionsUpdated);
    
    return () => {
      window.removeEventListener('permissionsUpdated', handlePermissionsUpdated);
    };
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await fetch('/api/payment/permissions');
      const data = await response.json();
      setPermissions(data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (productId: string) => {
    setPurchasing(productId);
    try {
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();
      
      if (response.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        console.error('❌ Checkout failed:', data);
        alert(data.error || 'Failed to start purchase. Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to start purchase. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const monthlyProductId = process.env.NEXT_PUBLIC_PRO_MEMBERSHIP_PID || '';
  const lifetimeProductId = process.env.NEXT_PUBLIC_LIFETIME_PRO_PID || '';

  if (loading) {
    return (
      <div className="container mx-auto p-8 max-w-6xl">
        <div className="text-center py-12">
          <div className="mx-auto mb-4 w-16 h-16 border-4 border-gray-200 dark:border-gray-800 border-t-black dark:border-t-white rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Choose Your Plan
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Unlock all courses and features
        </p>
      </div>

      {/* Current Status */}
      {permissions && (permissions.hasLifetimeMembership || permissions.hasActiveSubscription) && (
        <Card className="mb-8 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">
                  You have {permissions.hasLifetimeMembership ? 'Lifetime' : 'Pro'} membership
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  All courses are unlocked for you!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Monthly Pro */}
        <Card className="border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-2xl">Pro Monthly</CardTitle>
              {permissions?.hasActiveSubscription && (
                <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-0">
                  ACTIVE
                </Badge>
              )}
            </div>
            <CardDescription>Perfect for consistent learners</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                $10 <span className="text-lg font-normal text-gray-500">/month</span>
              </div>
              {permissions?.hasActiveSubscription && permissions?.subscriptionPeriodStart && permissions?.subscriptionPeriodEnd ? (
                <div className="space-y-1">
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    ✓ 当前订阅有效
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    订阅期: {new Date(permissions.subscriptionPeriodStart).toLocaleDateString('zh-CN')} - {new Date(permissions.subscriptionPeriodEnd).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Billed monthly, cancel anytime
                </p>
              )}
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Unlimited access to all courses
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  New courses added regularly
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Progress tracking & stats
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Cancel anytime
                </span>
              </li>
            </ul>

            <Button
              onClick={() => handlePurchase(monthlyProductId)}
              disabled={purchasing === monthlyProductId}
              className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              {purchasing === monthlyProductId ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : permissions?.hasActiveSubscription ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Renew Subscription
                </>
              ) : (
                'Subscribe Now'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Lifetime Pro */}
        <Card className="border-gray-900 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
              BEST VALUE
            </Badge>
          </div>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-2xl">Lifetime Pro</CardTitle>
              {permissions?.hasLifetimeMembership && (
                <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-0">
                  OWNED
                </Badge>
              )}
            </div>
            <CardDescription>One-time payment, lifetime access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                $99 <span className="text-lg font-normal text-gray-500">/once</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Save $20+ compared to 12 months
              </p>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Everything in Pro</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Lifetime access to all current & future courses
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Priority support
                </span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  One-time payment, no recurring fees
                </span>
              </li>
            </ul>

            <Button
              onClick={() => handlePurchase(lifetimeProductId)}
              disabled={purchasing === lifetimeProductId || permissions?.hasLifetimeMembership}
              className="w-full bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 text-white dark:text-black hover:from-gray-800 hover:to-gray-600 dark:hover:from-gray-100 dark:hover:to-gray-400"
            >
              {purchasing === lifetimeProductId ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : permissions?.hasLifetimeMembership ? (
                'Current Plan'
              ) : (
                'Get Lifetime Access'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Can I cancel my subscription anytime?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Yes! You can cancel your monthly subscription at any time. You&apos;ll continue to have access until the end of your billing period.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              What&apos;s the difference between Pro and Lifetime?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pro is a monthly subscription that gives you access as long as you&apos;re subscribed. Lifetime is a one-time payment that gives you access forever, including all future courses.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Can I purchase individual courses?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Yes! You can purchase individual courses from the Course Store. However, a Pro or Lifetime membership is more cost-effective if you plan to take multiple courses.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
