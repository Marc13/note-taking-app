import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import prisma from "@/lib/prisma";
import { CreateArticleForm } from "@/components/create-article-form";
import { createArticle } from "./actions";

/**
 * Page metadata for SEO
 */
export const metadata = {
  title: "Create New Article - Knowledge Hub",
  description: "Create a new knowledge base article",
};

/**
 * Create New Article Page
 * 
 * Provides a form for creating new knowledge base articles with
 * title, content, category, and tags.
 */
export default async function CreateArticlePage() {
  try {
    // Fetch unique categories for the dropdown
    const categories = await prisma.knowledgeArticle.findMany({
      select: {
        category: true,
      },
      distinct: ["category"],
      orderBy: {
        category: "asc",
      },
    });

    const uniqueCategories = categories.map((c) => c.category);

    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/knowledge-hub">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Knowledge Hub
            </Link>
          </Button>
        </div>

        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/knowledge-hub">Knowledge Hub</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Article</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Create New Article
          </h1>
          <p className="text-muted-foreground">
            Add a new article to your knowledge base
          </p>
        </div>

        {/* Create Article Form */}
        <CreateArticleForm
          categories={uniqueCategories}
          action={createArticle}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading create article page:", error);
    
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
        <div className="mb-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/knowledge-hub">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Knowledge Hub
            </Link>
          </Button>
        </div>
        
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-destructive mb-4">
            Error Loading Page
          </h2>
          <p className="text-muted-foreground">
            Unable to load the create article form. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}

