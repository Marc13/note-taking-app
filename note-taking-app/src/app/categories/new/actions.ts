"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Server Action: Create a new category
 * 
 * This server action handles the creation of a new category in the database.
 * It validates the input, checks for duplicates, and creates the category.
 * 
 * @param formData - FormData object containing name, description, and color
 * @returns Error object if validation fails, otherwise redirects to categories page
 */
export async function createCategory(formData: FormData) {
  try {
    // Extract form data from the FormData object
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const color = formData.get("color") as string;

    // Validate required fields - name and color are mandatory
    if (!name) {
      return {
        error: "Category name is required",
      };
    }

    if (!color) {
      return {
        error: "Category color is required",
      };
    }

    // Get the first user from the database
    // TODO: Replace this with actual user authentication session
    const user = await prisma.user.findFirst();

    if (!user) {
      return {
        error: "No user found. Please run the seed command first.",
      };
    }

    // Check if a category with the same name already exists for this user
    // This prevents duplicate category names per user
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: name.trim(),
        userId: user.id,
      },
    });

    if (existingCategory) {
      return {
        error: "A category with this name already exists",
      };
    }

    // Create the new category in the database
    await prisma.category.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        color: color,
        userId: user.id,
      },
    });

    // Revalidate the pages that display categories to show the new category
    revalidatePath("/categories");
    revalidatePath("/dashboard");
    revalidatePath("/notes");

    // Redirect to the categories page to show the newly created category
    redirect("/categories");
  } catch (error) {
    console.error("Error creating category:", error);
    return {
      error: "Failed to create category. Please try again.",
    };
  }
}

