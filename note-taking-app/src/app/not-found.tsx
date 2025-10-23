'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-app-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-primary-blue/10 p-6">
            <FileQuestion className="h-24 w-24 text-primary-blue" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-primary-blue mb-4">404</h1>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="bg-primary-blue hover:bg-primary-blue/90 text-white transition-all duration-200 active:scale-95"
            size="lg"
          >
            <Link href="/dashboard">
              <Home className="mr-2 h-5 w-5" />
              Go to Dashboard
            </Link>
          </Button>
          
          <Button
            variant="outline"
            className="border-primary-blue text-primary-blue hover:bg-primary-blue/10 transition-all duration-200 active:scale-95"
            size="lg"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}

