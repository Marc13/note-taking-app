import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { Note, NoteStatus } from "@prisma/client";

export const metadata = {
  title: "Dashboard - My Notes App",
  description: "View your notes dashboard with recent activity and statistics",
};

// Helper function to format dates
function formatDate(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}

// Helper function to get badge color based on status
function getStatusColor(status: NoteStatus): string {
  switch (status) {
    case "DRAFT":
      return "bg-[#FF9013] text-white hover:bg-[#FF9013]/90";
    case "PUBLISHED":
      return "bg-[#0046FF] text-white hover:bg-[#0046FF]/90";
    case "ARCHIVED":
      return "bg-[#73C8D2] text-white hover:bg-[#73C8D2]/90";
    default:
      return "bg-gray-500 text-white";
  }
}

export default async function DashboardPage() {
  try {
    // Execute all Prisma queries in parallel for better performance
    const [
      totalNotes,
      recentNotes,
      statusCounts,
      totalCategories,
      totalTasks,
      completedTasks,
      activeProjects,
    ] = await Promise.all([
      // Total note count
      prisma.note.count(),

      // Recent 5 notes with category
      prisma.note.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
        },
      }),

      // Notes by status (using groupBy)
      prisma.note.groupBy({
        by: ["status"],
        _count: {
          status: true,
        },
      }),

      // Total categories count
      prisma.category.count(),

      // Total tasks count
      prisma.task.count(),

      // Completed tasks count
      prisma.task.count({
        where: { completed: true },
      }),

      // Active projects count (assuming "active" status)
      prisma.project.count({
        where: {
          status: {
            in: ["active", "ACTIVE", "in_progress", "IN_PROGRESS"],
          },
        },
      }),
    ]);

    // Process status counts into a more usable format
    const statusCountMap: Record<NoteStatus, number> = {
      DRAFT: 0,
      PUBLISHED: 0,
      ARCHIVED: 0,
    };

    statusCounts.forEach((item) => {
      statusCountMap[item.status] = item._count.status;
    });

    // Check if there are no notes
    const hasNoNotes = totalNotes === 0;

    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your notes and tasks.
          </p>
        </div>

        {/* Empty State */}
        {hasNoNotes ? (
          <div className="mb-8">
            <Alert className="border-[#0046FF]/20 bg-[#0046FF]/5">
              <AlertDescription className="text-base">
                No notes yet. Create your first note to get started!
              </AlertDescription>
            </Alert>
            <div className="mt-4 flex justify-center">
              <Button
                asChild
                className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white font-semibold px-6 py-6 text-lg"
              >
                <Link href="/notes">Create New Note</Link>
              </Button>
            </div>
          </div>
        ) : null}

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Total Notes Card */}
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-bold text-[#0046FF]">
                {totalNotes}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All your notes
              </p>
            </CardContent>
          </Card>

          {/* Draft Notes Card */}
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Draft Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-bold text-[#FF9013]">
                {statusCountMap.DRAFT}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Notes in progress
              </p>
            </CardContent>
          </Card>

          {/* Published Notes Card */}
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Published Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-bold text-[#0046FF]">
                {statusCountMap.PUBLISHED}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ready to view
              </p>
            </CardContent>
          </Card>

          {/* Archived Notes Card */}
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Archived Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-bold text-[#73C8D2]">
                {statusCountMap.ARCHIVED}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Archived items
              </p>
            </CardContent>
          </Card>

          {/* Categories Card */}
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-bold text-[#73C8D2]">
                {totalCategories}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Note categories
              </p>
            </CardContent>
          </Card>

          {/* Tasks Card */}
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-bold text-[#0046FF]">
                {completedTasks}/{totalTasks}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Completed tasks
              </p>
            </CardContent>
          </Card>

          {/* Active Projects Card */}
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl md:text-4xl font-bold text-[#FF9013]">
                {activeProjects}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                In progress
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Notes Section */}
        {!hasNoNotes && recentNotes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Recent Notes
            </h2>
            <Card className="bg-white shadow-md">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentNotes.map((note) => (
                    <div
                      key={note.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b last:border-b-0 last:pb-0"
                    >
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/notes/${note.id}`}
                          className="text-lg font-semibold text-foreground hover:text-[#0046FF] transition-colors line-clamp-1"
                        >
                          {note.title}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge
                            className={getStatusColor(note.status)}
                            variant="default"
                          >
                            {note.status}
                          </Badge>
                          {note.category && (
                            <span className="text-sm text-muted-foreground">
                              • {note.category.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(new Date(note.createdAt))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white font-semibold px-6 py-6"
              size="lg"
            >
              <Link href="/notes">Create New Note</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#0046FF] text-[#0046FF] hover:bg-[#0046FF]/10 font-semibold px-6 py-6"
              size="lg"
            >
              <Link href="/notes">View All Notes</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching dashboard data:", error);

    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Dashboard
          </h1>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load dashboard data. Please check your database connection
            and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}

