import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import prisma from "@/lib/prisma";
import { CreateTaskForm } from "@/components/create-task-form";
import { createTask } from "./actions";

/**
 * Page metadata for SEO
 */
export const metadata = {
  title: "Create New Task - My Notes App",
  description: "Create a new task",
};

/**
 * Create New Task Page
 * 
 * Provides a form for creating new tasks with
 * title, description, priority, due date, and project assignment.
 */
export default async function CreateTaskPage() {
  try {
    // Fetch projects for the dropdown
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/tasks">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tasks
            </Link>
          </Button>
        </div>

        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/tasks">Tasks</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Task</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Create New Task
          </h1>
          <p className="text-muted-foreground">
            Add a new task to your list
          </p>
        </div>

        {/* Create Task Form */}
        <CreateTaskForm
          projects={projects}
          action={createTask}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading create task page:", error);
    
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
        <div className="mb-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/tasks">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tasks
            </Link>
          </Button>
        </div>
        
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-destructive mb-4">
            Error Loading Page
          </h2>
          <p className="text-muted-foreground">
            Unable to load the create task form. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}

