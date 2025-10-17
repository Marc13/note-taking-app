import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Loading state for the Projects page
 * 
 * Displays skeleton placeholders for project cards
 */
export default function ProjectsLoading() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
      {/* Back Button Skeleton */}
      <div className="mb-4">
        <Skeleton className="h-9 w-40" />
      </div>

      {/* Page Header Skeleton */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-44" />
        </div>
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Filter Skeleton */}
      <div className="mb-6">
        <div className="w-full sm:w-64 space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Project Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-white">
            <CardHeader>
              <div className="flex items-start justify-between gap-3 mb-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar Skeleton */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>

              {/* Task Stats Skeleton */}
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>

              {/* Date Skeleton */}
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

