'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error') || 'Payment failed or was canceled';

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-red-200 dark:border-red-900">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-6xl">❌</div>
          <CardTitle className="text-3xl text-red-600 dark:text-red-400">
            Payment Failed
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            {error}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
          >
            Go to Dashboard
          </Button>
          <Button
            onClick={() => router.push('/dashboard/membership')}
            variant="outline"
            className="w-full"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

