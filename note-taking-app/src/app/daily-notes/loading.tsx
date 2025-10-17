import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Loading state for the Daily Notes page
 * 
 * Displays skeleton placeholders for calendar and entry display
 */
export default function DailyNotesLoading() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
      {/* Back Button Skeleton */}
      <div className="mb-4">
        <Skeleton className="h-9 w-40" />
      </div>

      {/* Page Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-56 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>

      {/* Calendar and Entry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent className="flex justify-center">
            <Skeleton className="h-[350px] w-[350px]" />
          </CardContent>
        </Card>

        {/* Entry Display Skeleton */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-28" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

