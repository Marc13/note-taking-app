import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArchiveRestore, Search, ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { NoteStatus } from "@prisma/client";
import { ArchiveFilters } from "@/components/archive-filters";

export const metadata = {
  title: "Archive - My Notes App",
  description: "View archived notes",
};

// Helper function to format dates
function formatDate(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}

// Helper function to truncate text
function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// Pagination component
function PaginationControls({ 
  currentPage, 
  totalPages, 
  hasNextPage, 
  hasPreviousPage 
}: {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}) {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <Button
        asChild
        variant="outline"
        size="sm"
        disabled={!hasPreviousPage}
        aria-label="Previous page"
      >
        <Link href={hasPreviousPage ? `?page=${currentPage - 1}` : "#"}>
          Previous
        </Link>
      </Button>

      {pageNumbers.map((pageNum) => (
        <Button
          key={pageNum}
          asChild
          variant={pageNum === currentPage ? "default" : "outline"}
          size="sm"
          aria-label={`Go to page ${pageNum}`}
          aria-current={pageNum === currentPage ? "page" : undefined}
          className={pageNum === currentPage ? "bg-[#0046FF] hover:bg-[#0046FF]/90" : ""}
        >
          <Link href={`?page=${pageNum}`}>
            {pageNum}
          </Link>
        </Button>
      ))}

      <Button
        asChild
        variant="outline"
        size="sm"
        disabled={!hasNextPage}
        aria-label="Next page"
      >
        <Link href={hasNextPage ? `?page=${currentPage + 1}` : "#"}>
          Next
        </Link>
      </Button>
    </div>
  );
}

interface ArchivePageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    dateFilter?: string;
  }>;
}

export default async function ArchivePage({ searchParams }: ArchivePageProps) {
  try {
    const params = await searchParams;
    const currentPage = parseInt(params.page || "1");
    const searchQuery = params.search || "";
    const dateFilter = params.dateFilter || "all";
    const itemsPerPage = 10;
    const skip = (currentPage - 1) * itemsPerPage;

    // Build where clause for filtering
    const whereClause: any = {
      status: NoteStatus.ARCHIVED,
    };
    
    // Search in both title and content
    if (searchQuery) {
      whereClause.OR = [
        {
          title: {
            contains: searchQuery,
          },
        },
        {
          content: {
            contains: searchQuery,
          },
        },
      ];
    }
    
    // Date filter
    if (dateFilter && dateFilter !== "all") {
      const now = new Date();
      let dateThreshold: Date;
      
      switch (dateFilter) {
        case "7days":
          dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30days":
          dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "90days":
          dateThreshold = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateThreshold = new Date(0); // All time
      }
      
      whereClause.updatedAt = {
        gte: dateThreshold,
      };
    }

    // Execute queries in parallel
    const [archivedNotes, totalNotes] = await Promise.all([
      // Get paginated archived notes
      prisma.note.findMany({
        where: whereClause,
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip,
        take: itemsPerPage,
      }),

      // Get total count for pagination
      prisma.note.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalNotes / itemsPerPage);
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    // Check for empty states
    const hasNoNotes = totalNotes === 0;
    const hasSearchResults = searchQuery && archivedNotes.length === 0;

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
            Archive
          </h1>
          <p className="text-muted-foreground">
            View and manage your archived notes ({totalNotes} total)
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <ArchiveFilters />
        </div>

        {/* Empty States */}
        {hasNoNotes && !searchQuery ? (
          <Alert className="border-[#73C8D2]/20 bg-[#73C8D2]/5">
            <AlertDescription className="text-base">
              No archived notes. Archive some notes to see them here.
            </AlertDescription>
          </Alert>
        ) : hasSearchResults ? (
          <Alert className="border-[#FF9013]/20 bg-[#FF9013]/5">
            <AlertDescription className="text-base">
              No archived notes match your search. Try adjusting your search terms.
            </AlertDescription>
          </Alert>
        ) : null}

        {/* Archived Notes List - Desktop Table View */}
        <div className="hidden md:block">
          <Card className="bg-white shadow-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Archived</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archivedNotes.map((note) => (
                  <TableRow key={note.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <Link
                          href={`/notes/${note.id}`}
                          className="font-medium text-foreground hover:text-[#0046FF] transition-colors"
                        >
                          {note.title}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {truncateText(note.content)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {note.category ? (
                        <Badge variant="outline" className="text-xs">
                          {note.category.name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">No category</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(new Date(note.updatedAt))}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-[#73C8D2] border-[#73C8D2] hover:bg-[#73C8D2] hover:text-white"
                        aria-label={`Restore ${note.title}`}
                      >
                        <ArchiveRestore className="h-4 w-4 mr-2" />
                        Restore
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Archived Notes List - Mobile Card View */}
        <div className="md:hidden space-y-4">
          {archivedNotes.map((note) => (
            <Card key={note.id} className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">
                    <Link
                      href={`/notes/${note.id}`}
                      className="text-foreground hover:text-[#0046FF] transition-colors"
                    >
                      {note.title}
                    </Link>
                  </CardTitle>
                  <Badge
                    className="bg-[#73C8D2] text-white hover:bg-[#73C8D2]/90"
                    variant="default"
                  >
                    Archived
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {truncateText(note.content, 150)}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {note.category && (
                      <Badge variant="outline" className="text-xs">
                        {note.category.name}
                      </Badge>
                    )}
                    {note.tags.slice(0, 2).map((noteTag) => (
                      <Badge key={noteTag.tag.id} variant="secondary" className="text-xs">
                        {noteTag.tag.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(new Date(note.updatedAt))}
                  </div>
                </div>
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full text-[#73C8D2] border-[#73C8D2] hover:bg-[#73C8D2] hover:text-white"
                    aria-label={`Restore ${note.title}`}
                  >
                    <ArchiveRestore className="h-4 w-4 mr-2" />
                    Restore Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching archived notes:", error);

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
            Archive
          </h1>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load archived notes. Please check your database connection and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}
