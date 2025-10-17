import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Plus } from "lucide-react";
import prisma from "@/lib/prisma";
import { ProjectFilters } from "@/components/project-filters";
import { ProjectCard } from "@/components/project-card";

/**
 * Page metadata for SEO
 */
export const metadata = {
  title: "Projects - My Notes App",
  description: "Track your projects and progress",
};

/**
 * Props for the Projects page
 */
interface ProjectsPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

/**
 * Projects Page Component
 * 
 * Displays all projects with progress tracking and status indicators.
 */
export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  try {
    const params = await searchParams;
    const statusFilter = params.status || "all";

    // Build where clause
    const whereClause: any = {};

    // Filter by status
    if (statusFilter && statusFilter !== "all") {
      whereClause.status = statusFilter.toUpperCase().replace("-", "_");
    }

    // Fetch projects with task counts
    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
        tasks: {
          where: {
            completed: true,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: [
        {
          status: "asc", // Active first
        },
        {
          progress: "desc",
        },
      ],
    });

    // Transform data for client component
    const projectsWithCounts = projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      progress: project.progress,
      createdAt: project.createdAt.toISOString(),
      totalTasks: project._count.tasks,
      completedTasks: project.tasks.length,
    }));

    const hasProjects = projects.length > 0;

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Projects
            </h1>
            <Button
              asChild
              className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white w-full sm:w-auto"
            >
              <Link href="/projects/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Link>
            </Button>
          </div>
          <p className="text-muted-foreground">
            Track your projects and progress ({projects.length} projects)
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <ProjectFilters />
        </div>

        {/* Empty State */}
        {!hasProjects ? (
          <Alert className="border-[#0046FF]/20 bg-[#0046FF]/5">
            <AlertDescription className="text-base">
              No projects yet. Start your first project!
            </AlertDescription>
          </Alert>
        ) : null}

        {/* Projects Grid */}
        {hasProjects && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsWithCounts.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching projects:", error);

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
            Projects
          </h1>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load projects. Please check your database connection and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}

