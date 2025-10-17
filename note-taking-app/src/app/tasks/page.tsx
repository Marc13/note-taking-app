import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Plus } from "lucide-react";
import prisma from "@/lib/prisma";
import { TaskFilters } from "@/components/task-filters";
import { TaskList } from "@/components/task-list";

/**
 * Page metadata for SEO
 */
export const metadata = {
  title: "Tasks - My Notes App",
  description: "Manage your tasks and to-dos",
};

/**
 * Props for the Tasks page
 */
interface TasksPageProps {
  searchParams: Promise<{
    completion?: string;
    priority?: string;
    project?: string;
    sort?: string;
  }>;
}

/**
 * Tasks Page Component
 * 
 * Displays all tasks with filtering, sorting, and completion tracking.
 */
export default async function TasksPage({ searchParams }: TasksPageProps) {
  try {
    const params = await searchParams;
    const completionFilter = params.completion || "all";
    const priorityFilter = params.priority || "all";
    const projectFilter = params.project || "all";
    const sortBy = params.sort || "default";

    // Build where clause
    const whereClause: any = {};

    // Filter by completion status
    if (completionFilter === "completed") {
      whereClause.completed = true;
    } else if (completionFilter === "incomplete") {
      whereClause.completed = false;
    }

    // Filter by priority
    if (priorityFilter && priorityFilter !== "all") {
      whereClause.priority = priorityFilter.toUpperCase();
    }

    // Filter by project
    if (projectFilter && projectFilter !== "all") {
      whereClause.projectId = projectFilter;
    }

    // Determine sort order
    let orderBy: any = {};
    if (sortBy === "dueDate") {
      orderBy = { dueDate: "asc" };
    } else if (sortBy === "priority") {
      // We'll sort by priority in code since Prisma doesn't support enum ordering easily
      orderBy = { createdAt: "desc" };
    } else if (sortBy === "created") {
      orderBy = { createdAt: "desc" };
    } else {
      // Default: incomplete first, then by due date, then by priority
      orderBy = [
        { completed: "asc" },
        { dueDate: "asc" },
      ];
    }

    // Fetch tasks with related project data
    const [tasks, projects] = await Promise.all([
      prisma.task.findMany({
        where: whereClause,
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: orderBy,
      }),
      prisma.project.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

    // Manual priority sorting if needed
    let sortedTasks = tasks;
    if (sortBy === "priority") {
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      sortedTasks = [...tasks].sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    }

    // Convert dates to ISO strings
    const tasksWithStringDates = sortedTasks.map((task) => ({
      ...task,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      createdAt: task.createdAt.toISOString(),
    }));

    const hasTasks = tasks.length > 0;

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
              Tasks
            </h1>
            <Button
              asChild
              className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white w-full sm:w-auto"
            >
              <Link href="/tasks/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Link>
            </Button>
          </div>
          <p className="text-muted-foreground">
            Manage your tasks and to-dos ({tasks.length} tasks)
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <TaskFilters projects={projects} />
        </div>

        {/* Empty State */}
        {!hasTasks ? (
          <Alert className="border-[#0046FF]/20 bg-[#0046FF]/5">
            <AlertDescription className="text-base">
              No tasks yet. Add your first task!
            </AlertDescription>
          </Alert>
        ) : null}

        {/* Task List */}
        {hasTasks && <TaskList tasks={tasksWithStringDates} />}
      </div>
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);

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
            Tasks
          </h1>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load tasks. Please check your database connection and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}

