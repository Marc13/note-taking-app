"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

/**
 * Server Action: Create a new project
 * 
 * Handles form submission for creating new projects with validation,
 * database interaction, and navigation.
 */
export async function createProject(formData: FormData) {
  try {
    // Extract and validate form data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const progress = formData.get("progress") as string;

    // Validation
    if (!name || name.trim().length === 0) {
      return { error: "Project name is required" };
    }

    if (!status || status.trim().length === 0) {
      return { error: "Status is required" };
    }

    // Validate status value
    const validStatuses = ["ACTIVE", "COMPLETED", "ON_HOLD"];
    if (!validStatuses.includes(status.toUpperCase())) {
      return { error: "Invalid status value" };
    }

    // Validate progress (0-100)
    const progressNum = parseInt(progress) || 0;
    if (progressNum < 0 || progressNum > 100) {
      return { error: "Progress must be between 0 and 100" };
    }

    // Create the project in the database
    await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        status: status.toUpperCase(),
        progress: progressNum,
      },
    });

    // Revalidate the projects page to show the new project
    revalidatePath("/projects");

    // Redirect to the projects page
    redirect("/projects");
  } catch (error) {
    // Handle redirect errors (Next.js throws these for navigation)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    
    console.error("Error creating project:", error);
    return { error: "Failed to create project. Please try again." };
  }
}

