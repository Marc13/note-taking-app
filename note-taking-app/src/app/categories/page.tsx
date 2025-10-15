import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { CategoryCard } from "@/components/category-card";

export const metadata = {
  title: "Categories - My Notes App",
  description: "Manage your note categories",
};

export default async function CategoriesPage() {
  try {
    // Query all categories with note count
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            notes: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const hasNoCategories = categories.length === 0;

    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Categories
              </h1>
              <p className="text-muted-foreground">
                Organize your notes with categories ({categories.length} total)
              </p>
            </div>
            
            {/* Add Category Button */}
            <Button
              asChild
              className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white font-semibold"
            >
              <Link href="/categories/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Link>
            </Button>
          </div>
        </div>

        {/* Empty State */}
        {hasNoCategories && (
          <Alert className="border-[#0046FF]/20 bg-[#0046FF]/5 mb-6">
            <AlertDescription className="text-base">
              No categories yet. Create your first category to organize your notes!
            </AlertDescription>
          </Alert>
        )}

        {/* Categories Grid */}
        {!hasNoCategories && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}

        {/* Empty State with Add Button */}
        {hasNoCategories && (
          <div className="text-center py-12">
            <Button
              asChild
              className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white font-semibold"
            >
              <Link href="/categories/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Category
              </Link>
            </Button>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching categories:", error);

    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Categories
          </h1>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load categories. Please check your database connection and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}
