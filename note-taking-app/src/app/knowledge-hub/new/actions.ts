"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

/**
 * Server Action: Create a new knowledge base article
 * 
 * Handles form submission for creating new articles with validation,
 * database interaction, and navigation.
 */
export async function createArticle(formData: FormData) {
  try {
    // Extract and validate form data
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const tags = formData.get("tags") as string;

    // Validation
    if (!title || title.trim().length === 0) {
      return { error: "Article title is required" };
    }

    if (!content || content.trim().length === 0) {
      return { error: "Article content is required" };
    }

    if (!category || category.trim().length === 0) {
      return { error: "Category is required" };
    }

    // Process tags: trim and create comma-separated string
    const processedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .join(", ");

    // Create the article in the database
    const article = await prisma.knowledgeArticle.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: category.trim(),
        tags: processedTags || null,
      },
    });

    // Revalidate the knowledge hub page to show the new article
    revalidatePath("/knowledge-hub");

    // Redirect to the knowledge hub page
    redirect("/knowledge-hub");
  } catch (error) {
    // Handle redirect errors (Next.js throws these for navigation)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    
    console.error("Error creating article:", error);
    return { error: "Failed to create article. Please try again." };
  }
}

