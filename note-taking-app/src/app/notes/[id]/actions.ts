"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Delete a note
 * 
 * Deletes a note and all its tag relationships from the database.
 * 
 * @param noteId - The ID of the note to delete
 */
export async function deleteNote(noteId: string) {
  try {
    // Delete the note (tag relationships will be deleted automatically due to CASCADE)
    await prisma.note.delete({
      where: { id: noteId },
    });

    // Revalidate relevant pages
    revalidatePath("/notes");
    revalidatePath("/dashboard");

    // Redirect to notes list page
    redirect("/notes");
  } catch (error: any) {
    // Check if this is a redirect error (Next.js redirects throw errors)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    
    console.error("Error deleting note:", error);
    return {
      error: "Failed to delete note. Please try again.",
    };
  }
}

