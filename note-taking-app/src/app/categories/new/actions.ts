"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  try {
    // Extract form data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const color = formData.get("color") as string;

    // Validate required fields
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

    // Get the first user (since we don't have authentication yet)
    const user = await prisma.user.findFirst();

    if (!user) {
      return {
        error: "No user found. Please run the seed command first.",
      };
    }

    // Check if category with same name already exists for this user
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

    // Create the category
    await prisma.category.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        color: color,
        userId: user.id,
      },
    });

    // Revalidate the categories page to show the new category
    revalidatePath("/categories");
    revalidatePath("/dashboard");
    revalidatePath("/notes");

    // Redirect to the categories page
    redirect("/categories");
  } catch (error) {
    console.error("Error creating category:", error);
    return {
      error: "Failed to create category. Please try again.",
    };
  }
}

