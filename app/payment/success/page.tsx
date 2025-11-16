'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkoutId = searchParams.get('checkout_id');

    if (!checkoutId) {
      setError('No checkout ID provided');
      setVerifying(false);
      return;
    }

    // Set timeout for verification
    const timeoutId = setTimeout(() => {
      if (verifying) {
        setError('Payment verification timeout. Please check your account.');
        setVerifying(false);
      }
    }, 10000);

    // Verify payment status
    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ checkoutId }),
        });

        const data = await response.json();

        if (data.completed) {
          setVerified(true);
        } else {
          setError('Payment not completed yet. Please wait...');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError('Failed to verify payment');
      } finally {
        setVerifying(false);
        clearTimeout(timeoutId);
      }
    };

    verifyPayment();

    return () => clearTimeout(timeoutId);
  }, [searchParams]);

  if (error) {
    router.push(`/payment/fail?error=${encodeURIComponent(error)}`);
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-gray-200 dark:border-gray-800">
        <CardHeader className="text-center">
          {verifying ? (
            <>
              <div className="mx-auto mb-4 w-16 h-16 border-4 border-gray-200 dark:border-gray-800 border-t-black dark:border-t-white rounded-full animate-spin" />
              <CardTitle className="text-2xl">Verifying Payment...</CardTitle>
              <CardDescription>Please wait while we confirm your payment</CardDescription>
            </>
          ) : verified ? (
            <>
              <div className="mx-auto mb-4 text-6xl">✅</div>
              <CardTitle className="text-3xl text-green-600 dark:text-green-400">
                Payment Successful!
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Thank you for your purchase. Your access has been granted.
              </CardDescription>
            </>
          ) : null}
        </CardHeader>

        {verified && (
          <CardContent className="space-y-3">
            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => router.push('/dashboard/courses')}
              variant="outline"
              className="w-full"
            >
              Browse Courses
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

