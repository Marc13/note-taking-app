import Link from "next/link";
import { notFound } from "next/navigation";
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
import { EditArticleForm } from "@/components/edit-article-form";
import { updateArticle } from "./actions";

/**
 * Page metadata for SEO
 */
export const metadata = {
  title: "Edit Article - Knowledge Hub",
  description: "Edit an existing knowledge base article",
};

/**
 * Props for the Edit Article page
 */
interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Edit Article Page
 * 
 * Provides a form for editing existing knowledge base articles with
 * pre-filled data from the database.
 */
export default async function EditArticlePage({ params }: EditArticlePageProps) {
  try {
    const { id } = await params;

    // Fetch the article to edit
    const article = await prisma.knowledgeArticle.findUnique({
      where: {
        id: id,
      },
    });

    if (!article) {
      notFound();
    }

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
              <BreadcrumbPage>Edit Article</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Edit Article
          </h1>
          <p className="text-muted-foreground">
            Update the article details
          </p>
        </div>

        {/* Edit Article Form */}
        <EditArticleForm
          article={article}
          categories={uniqueCategories}
          action={updateArticle}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading edit article page:", error);
    
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
            Unable to load the edit article form. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}

