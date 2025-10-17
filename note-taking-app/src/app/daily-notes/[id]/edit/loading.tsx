import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Loading state for the Edit Daily Note page
 * 
 * Displays skeleton placeholders while the page is loading
 */
export default function EditDailyNoteLoading() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
      {/* Back Button Skeleton */}
      <div className="mb-4">
        <Skeleton className="h-9 w-40" />
      </div>

      {/* Breadcrumb Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-5 w-80" />
      </div>

      {/* Page Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-72 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Form Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-[300px] w-full" />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

