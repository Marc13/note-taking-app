import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ArticleDetailLoading() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
      {/* Back Button Skeleton */}
      <div className="mb-4">
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Breadcrumb Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Article Content Card */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          {/* Title Skeleton */}
          <Skeleton className="h-10 w-3/4 mb-4" />
          
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-28" />
          </div>

          {/* Tags Skeleton */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-18" />
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Content Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="py-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex gap-3 mt-8">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

