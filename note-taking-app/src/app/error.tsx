'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-app-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-2xl font-bold mb-2">
            Something went wrong!
          </AlertTitle>
          <AlertDescription className="text-base">
            We encountered an unexpected error while processing your request. 
            This issue has been logged and we&apos;ll look into it.
          </AlertDescription>
        </Alert>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">What happened?</h2>
          <p className="text-gray-600 mb-6">
            An error occurred while rendering this page. You can try reloading the page, 
            or return to the dashboard to continue using the app.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm font-mono text-red-800 break-all">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={reset}
              className="bg-primary-blue hover:bg-primary-blue/90 text-white transition-all duration-200 active:scale-95"
            >
              Try again
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary-blue text-primary-blue hover:bg-primary-blue/10 transition-all duration-200"
            >
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

