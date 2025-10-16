"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { NoteStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createNote(formData: FormData) {
  try {
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

    // Get the first user (since we don't have authentication yet)
    const user = await prisma.user.findFirst();

    if (!user) {
      return {
        error: "No user found. Please run the seed command first.",
      };
    }

    // Create the note
    const note = await prisma.note.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        status: status as NoteStatus,
        userId: user.id,
        categoryId: categoryId && categoryId !== "none" ? categoryId : null,
      },
    });

    // Create tag relationships if tags were selected
    if (selectedTags.length > 0) {
      await Promise.all(
        selectedTags.map((tagId) =>
          prisma.noteTag.create({
            data: {
              noteId: note.id,
              tagId: tagId,
            },
          })
        )
      );
    }

    // Revalidate the notes page to show the new note
    revalidatePath("/notes");
    revalidatePath("/dashboard");

    // Redirect to the newly created note
    redirect(`/notes/${note.id}`);
  } catch (error) {
    console.error("Error creating note:", error);
    return {
      error: "Failed to create note. Please try again.",
    };
  }
}

