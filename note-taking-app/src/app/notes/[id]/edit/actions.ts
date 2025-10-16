"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { NoteStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Update an existing note
 * 
 * Updates a note's title, content, status, category, and tags.
 * 
 * @param noteId - The ID of the note to update
 * @param formData - FormData containing the updated note fields
 */
export async function updateNote(noteId: string, formData: FormData) {
  // Extract form data
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const categoryId = formData.get("categoryId") as string;
  const status = (formData.get("status") as string) || "DRAFT";
  const selectedTags = formData.getAll("tags") as string[];

  // Validate required fields
  if (!title || !content) {
    return {
      error: "Title and content are required",
    };
  }

  try {
    // Update the note
    await prisma.note.update({
      where: { id: noteId },
      data: {
        title: title.trim(),
        content: content.trim(),
        status: status as NoteStatus,
        categoryId: categoryId && categoryId !== "none" ? categoryId : null,
      },
    });

    // Delete existing tag relationships
    await prisma.noteTag.deleteMany({
      where: { noteId },
    });

    // Create new tag relationships if tags were selected
    if (selectedTags.length > 0) {
      await Promise.all(
        selectedTags.map((tagId) =>
          prisma.noteTag.create({
            data: {
              noteId: noteId,
              tagId: tagId,
            },
          })
        )
      );
    }

    // Revalidate relevant pages
    revalidatePath("/notes");
    revalidatePath(`/notes/${noteId}`);
    revalidatePath("/dashboard");

    // Redirect to the updated note
    redirect(`/notes/${noteId}`);
  } catch (error: any) {
    // Check if this is a redirect error (Next.js redirects throw errors)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    
    console.error("Error updating note:", error);
    return {
      error: "Failed to update note. Please try again.",
    };
  }
}

