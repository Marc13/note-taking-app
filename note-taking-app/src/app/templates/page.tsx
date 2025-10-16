import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { TemplateFilters } from "@/components/template-filters";
import { TemplateCard } from "@/components/template-card";

/**
 * Page metadata for SEO
 */
export const metadata = {
  title: "Templates - My Notes App",
  description: "Browse and use note templates",
};

/**
 * Props for the Templates page
 */
interface TemplatesPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

/**
 * Templates Page Component
 * 
 * Displays all available note templates with search and filter functionality.
 * Users can preview templates and use them to create new notes.
 */
export default async function TemplatesPage({ searchParams }: TemplatesPageProps) {
  try {
    const params = await searchParams;
    const searchQuery = params.search || "";
    const categoryFilter = params.category || "";

    // Build where clause for filtering
    const whereClause: any = {};

    // Search in name and description
    if (searchQuery) {
      whereClause.OR = [
        {
          name: {
            contains: searchQuery,
          },
        },
        {
          description: {
            contains: searchQuery,
          },
        },
      ];
    }

    // Filter by category
    if (categoryFilter && categoryFilter !== "all") {
      whereClause.category = categoryFilter;
    }

    // Fetch all templates from database
    const templates = await prisma.template.findMany({
      where: whereClause,
      orderBy: {
        name: "asc",
      },
    });

    // Get unique categories for filter dropdown
    const categories = await prisma.template.findMany({
      select: {
        category: true,
      },
      distinct: ["category"],
      orderBy: {
        category: "asc",
      },
    });

    const uniqueCategories = categories.map((c) => c.category);

    const hasNoTemplates = templates.length === 0;

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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Templates
          </h1>
          <p className="text-muted-foreground">
            Browse and use note templates to get started quickly ({templates.length} templates)
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <TemplateFilters categories={uniqueCategories} />
        </div>

        {/* Empty States */}
        {hasNoTemplates && !searchQuery ? (
          <Alert className="border-[#0046FF]/20 bg-[#0046FF]/5">
            <AlertDescription className="text-base">
              No templates available. Check back later!
            </AlertDescription>
          </Alert>
        ) : hasNoTemplates ? (
          <Alert className="border-[#FF9013]/20 bg-[#FF9013]/5">
            <AlertDescription className="text-base">
              No templates match your search. Try adjusting your search terms or filters.
            </AlertDescription>
          </Alert>
        ) : null}

        {/* Templates Grid */}
        {!hasNoTemplates && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching templates:", error);

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
            Templates
          </h1>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load templates. Please check your database connection and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}

