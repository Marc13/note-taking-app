import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft } from "lucide-react";
import { CreateCategoryForm } from "@/components/create-category-form";
import { createCategory } from "./actions";

/**
 * Page metadata for SEO
 */
export const metadata = {
  title: "Create New Category - My Notes App",
  description: "Create a new category to organize your notes",
};

/**
 * New Category Page Component
 * 
 * This page allows users to create a new category with a name, description, and color.
 * It includes breadcrumb navigation, a back button, and the create category form.
 */
export default function NewCategoryPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-3xl">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6" aria-label="Breadcrumb">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/categories">Categories</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New Category</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Back Button */}
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/categories">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Link>
        </Button>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Create New Category
        </h1>
        <p className="text-muted-foreground">
          Create a category to organize your notes by topic or project
        </p>
      </div>

      {/* Create Category Form */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateCategoryForm action={createCategory} />
        </CardContent>
      </Card>
    </div>
  );
}

