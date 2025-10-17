import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Plus } from "lucide-react";
import prisma from "@/lib/prisma";
import { KnowledgeHubFilters } from "@/components/knowledge-hub-filters";
import { KnowledgeHubLayout } from "@/components/knowledge-hub-layout";

/**
 * Page metadata for SEO
 */
export const metadata = {
  title: "Knowledge Hub - My Notes App",
  description: "Browse documentation and guides",
};

export const revalidate = 0; // Disable caching

/**
 * Props for the Knowledge Hub page
 */
interface KnowledgeHubPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    tag?: string;
  }>;
}

/**
 * Knowledge Hub Page Component
 * 
 * Wiki-style documentation hub with articles organized by category and tags.
 * Includes search, filtering, and related articles functionality.
 */
export const dynamic = 'force-dynamic';

export default async function KnowledgeHubPage({ searchParams }: KnowledgeHubPageProps) {
  try {
    const params = await searchParams;
    const searchQuery = params.search || "";
    const categoryFilter = params.category || "";
    const tagFilter = params.tag || "";

    // Build where clause for filtering
    const whereClause: any = {};

    // Note: SQLite doesn't support case-insensitive contains
    // We'll fetch all articles and filter client-side for now
    const searchLower = searchQuery.toLowerCase();

    // Filter by category
    if (categoryFilter && categoryFilter !== "all") {
      whereClause.category = categoryFilter;
    }

    // Note: Tag filtering will be done client-side for accuracy
    // (SQLite contains might match partial strings)

    // Fetch all articles from database
    const [allArticles, categories] = await Promise.all([
      prisma.knowledgeArticle.findMany({
        where: whereClause,
        orderBy: {
          createdAt: "desc",
        },
      }),
      // Get unique categories
      prisma.knowledgeArticle.findMany({
        select: {
          category: true,
        },
        distinct: ["category"],
        orderBy: {
          category: "asc",
        },
      }),
    ]);

    // Client-side filtering for search and tags (SQLite limitations)
    let articles = allArticles;
    
    // Filter by search query
    if (searchQuery) {
      articles = articles.filter((article) => {
        const titleMatch = article.title.toLowerCase().includes(searchLower);
        const contentMatch = article.content.toLowerCase().includes(searchLower);
        return titleMatch || contentMatch;
      });
    }
    
    // Filter by tag (exact match in comma-separated list)
    if (tagFilter && tagFilter !== "all") {
      articles = articles.filter((article) => {
        if (!article.tags) return false;
        const articleTags = article.tags.split(",").map((tag) => tag.trim());
        return articleTags.includes(tagFilter);
      });
    }

    // Extract unique tags from all articles (SQLite stores as comma-separated string)
    const allTagsSet = new Set<string>();
    allArticles.forEach((article) => {
      if (article.tags) {
        const tagArray = article.tags.split(",").map((tag) => tag.trim());
        tagArray.forEach((tag) => {
          if (tag) allTagsSet.add(tag);
        });
      }
    });
    const allTags = Array.from(allTagsSet).sort();

    const uniqueCategories = categories.map((c) => c.category);
    const hasNoArticles = articles.length === 0;

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Knowledge Hub
            </h1>
            <Button
              asChild
              className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white w-full sm:w-auto"
            >
              <Link href="/knowledge-hub/new">
                <Plus className="h-4 w-4 mr-2" />
                Create New Article
              </Link>
            </Button>
          </div>
          <p className="text-muted-foreground">
            Browse documentation, guides, and helpful resources ({articles.length} articles)
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <KnowledgeHubFilters 
            categories={uniqueCategories}
            tags={allTags}
            currentTag={tagFilter}
          />
        </div>

        {/* Empty States */}
        {hasNoArticles && !searchQuery ? (
          <Alert className="border-[#0046FF]/20 bg-[#0046FF]/5">
            <AlertDescription className="text-base">
              No articles found. Content coming soon!
            </AlertDescription>
          </Alert>
        ) : hasNoArticles ? (
          <Alert className="border-[#FF9013]/20 bg-[#FF9013]/5">
            <AlertDescription className="text-base">
              No articles match your search. Try adjusting your search terms or filters.
            </AlertDescription>
          </Alert>
        ) : null}

        {/* Articles Layout - Sidebar on Desktop, Cards on Mobile */}
        {!hasNoArticles && (
          <KnowledgeHubLayout articles={articles} />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching knowledge articles:", error);

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
            Knowledge Hub
          </h1>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load articles. Please check your database connection and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}

