"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

/**
 * Server Action: Update an existing daily note
 * 
 * Handles form submission for updating daily notes with validation,
 * database interaction, and navigation.
 */
export async function updateDailyNote(formData: FormData) {
  try {
    // Extract and validate form data
    const id = formData.get("id") as string;
    const date = formData.get("date") as string;
    const content = formData.get("content") as string;
    const mood = formData.get("mood") as string;

    // Validation
    if (!id) {
      return { error: "Daily note ID is required" };
    }

    if (!content || content.trim().length === 0) {
      return { error: "Entry content is required" };
    }

    if (!mood || mood.trim().length === 0) {
      return { error: "Mood is required" };
    }

    if (!date) {
      return { error: "Date is required" };
    }

    // Update the daily note in the database
    await prisma.dailyNote.update({
      where: {
        id: id,
      },
      data: {
        date: new Date(date),
        content: content.trim(),
        mood: mood.trim(),
      },
    });

    // Revalidate the daily notes page
    revalidatePath("/daily-notes");

    // Redirect to the daily notes page
    redirect("/daily-notes");
  } catch (error) {
    // Handle redirect errors (Next.js throws these for navigation)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    
    console.error("Error updating daily note:", error);
    return { error: "Failed to update daily note. Please try again." };
  }
}

