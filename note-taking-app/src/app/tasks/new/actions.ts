"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

/**
 * Server Action: Create a new task
 * 
 * Handles form submission for creating new tasks with validation,
 * database interaction, and navigation.
 */
export async function createTask(formData: FormData) {
  try {
    // Extract and validate form data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const dueDate = formData.get("dueDate") as string;
    const projectId = formData.get("projectId") as string;

    // Validation
    if (!title || title.trim().length === 0) {
      return { error: "Task title is required" };
    }

    if (!priority || priority.trim().length === 0) {
      return { error: "Priority is required" };
    }

    // Validate priority value
    const validPriorities = ["LOW", "MEDIUM", "HIGH"];
    if (!validPriorities.includes(priority.toUpperCase())) {
      return { error: "Invalid priority value" };
    }

    // Create the task in the database
    await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority.toUpperCase() as "LOW" | "MEDIUM" | "HIGH",
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: projectId && projectId !== "none" ? projectId : null,
        completed: false,
      },
    });

    // Revalidate the tasks page to show the new task
    revalidatePath("/tasks");

    // Redirect to the tasks page
    redirect("/tasks");
  } catch (error) {
    // Handle redirect errors (Next.js throws these for navigation)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    
    console.error("Error creating task:", error);
    return { error: "Failed to create task. Please try again." };
  }
}

