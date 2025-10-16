import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading State for Knowledge Hub Page
 * 
 * Displays skeleton placeholders while articles are loading.
 * Matches the layout of the actual knowledge hub page.
 */
export default function KnowledgeHubLoading() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
      {/* Back Button Skeleton */}
      <div className="mb-4">
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Header Skeleton */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Filters Skeleton */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-full sm:w-64" />
        </div>
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <div className="flex flex-wrap gap-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-20" />
            ))}
          </div>
        </div>
      </div>

      {/* Article Cards Skeleton */}
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="bg-white shadow-md">
            <CardHeader>
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <Skeleton className="h-7 flex-1" />
                  <Skeleton className="h-8 w-8" />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="h-5 w-16" />
                  ))}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

