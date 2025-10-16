import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading State for New Category Page
 * 
 * Displays skeleton placeholders while the page is loading.
 * Matches the layout of the actual new category page for smooth transitions.
 */
export default function NewCategoryLoading() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-3xl">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Back Button Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-9 w-40" />
      </div>

      {/* Header Skeleton */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Form Skeleton */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-64" />
          </div>

          {/* Description field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-3 w-72" />
          </div>

          {/* Color field */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-48" />
            <div className="grid grid-cols-8 gap-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="w-12 h-12 rounded-lg" />
              ))}
            </div>
            <div className="pt-2">
              <Skeleton className="h-3 w-40 mb-2" />
              <div className="flex gap-3">
                <Skeleton className="h-12 w-16" />
                <Skeleton className="h-12 w-28" />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

