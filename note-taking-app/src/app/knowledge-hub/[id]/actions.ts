"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

/**
 * Server Action: Delete a knowledge base article
 * 
 * Handles deletion of articles with database interaction and navigation.
 */
export async function deleteArticle(articleId: string) {
  try {
    // Validate article ID
    if (!articleId) {
      return { error: "Article ID is required" };
    }

    // Delete the article from the database
    await prisma.knowledgeArticle.delete({
      where: {
        id: articleId,
      },
    });

    // Revalidate the knowledge hub page
    revalidatePath("/knowledge-hub");

    // Redirect to the knowledge hub page
    redirect("/knowledge-hub");
  } catch (error) {
    // Handle redirect errors (Next.js throws these for navigation)
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    
    console.error("Error deleting article:", error);
    return { error: "Failed to delete article. Please try again." };
  }
}

