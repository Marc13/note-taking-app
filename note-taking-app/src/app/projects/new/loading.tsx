import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Loading state for the Create New Project page
 * 
 * Displays skeleton placeholders while the page is loading
 */
export default function CreateProjectLoading() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
      {/* Back Button Skeleton */}
      <div className="mb-4">
        <Skeleton className="h-9 w-40" />
      </div>

      {/* Breadcrumb Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Page Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-72 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Form Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-3 w-96" />
          </div>

          {/* Status Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Progress Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-3 w-full" />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

