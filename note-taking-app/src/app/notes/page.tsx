import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { Note, NoteStatus } from "@prisma/client";
import { NotesFilters } from "@/components/notes-filters";

export const metadata = {
  title: "Notes - My Notes App",
  description: "Browse and manage all your notes",
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

// Helper function to get badge color based on status
function getStatusColor(status: NoteStatus): string {
  switch (status) {
    case "DRAFT":
      return "bg-[#FF9013] text-white hover:bg-[#FF9013]/90";
    case "PUBLISHED":
      return "bg-[#0046FF] text-white hover:bg-[#0046FF]/90";
    case "ARCHIVED":
      return "bg-[#73C8D2] text-white hover:bg-[#73C8D2]/90";
    default:
      return "bg-gray-500 text-white";
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

interface NotesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    category?: string;
  }>;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  try {
    const params = await searchParams;
    const currentPage = parseInt(params.page || "1");
    const searchQuery = params.search || "";
    const statusFilter = params.status || "";
    const categoryFilter = params.category || "";
    const itemsPerPage = 10;
    const skip = (currentPage - 1) * itemsPerPage;

    // Build where clause for filtering
    const whereClause: any = {};
    
    // Search in both title and content
    if (searchQuery) {
      whereClause.OR = [
        {
          title: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      ];
    }
    
    if (statusFilter && statusFilter !== "all") {
      whereClause.status = statusFilter;
    }
    
    if (categoryFilter && categoryFilter !== "all") {
      whereClause.categoryId = categoryFilter;
    }

    // Execute queries in parallel
    const [notes, totalNotes, categories] = await Promise.all([
      // Get paginated notes
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

      // Get all categories for filter dropdown
      prisma.category.findMany({
        orderBy: { name: "asc" },
      }),
    ]);

    const totalPages = Math.ceil(totalNotes / itemsPerPage);
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    // Check for empty states
    const hasNoNotes = totalNotes === 0;
    const hasSearchResults = searchQuery && notes.length === 0;

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
            Notes
          </h1>
          <p className="text-muted-foreground">
            Browse and manage all your notes ({totalNotes} total)
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search and Filter Controls */}
            <NotesFilters categories={categories} />

            {/* Create New Note Button */}
            <Button
              asChild
              className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white font-semibold"
            >
              <Link href="/notes/new">
                <Plus className="h-4 w-4 mr-2" />
                Create New Note
              </Link>
            </Button>
          </div>
        </div>

        {/* Empty States */}
        {hasNoNotes && !searchQuery ? (
          <Alert className="border-[#0046FF]/20 bg-[#0046FF]/5">
            <AlertDescription className="text-base">
              No notes found. Create your first note to get started!
            </AlertDescription>
          </Alert>
        ) : hasSearchResults ? (
          <Alert className="border-[#FF9013]/20 bg-[#FF9013]/5">
            <AlertDescription className="text-base">
              No notes match your search. Try adjusting your search terms.
            </AlertDescription>
          </Alert>
        ) : null}

        {/* Notes List - Desktop Table View */}
        <div className="hidden md:block">
          <Card className="bg-white shadow-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notes.map((note) => (
                  <TableRow key={note.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Link
                        href={`/notes/${note.id}`}
                        className="font-medium text-foreground hover:text-[#0046FF] transition-colors"
                      >
                        {note.title}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        {truncateText(note.content)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(note.status)}
                        variant="default"
                      >
                        {note.status}
                      </Badge>
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
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/notes/${note.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Notes List - Mobile Card View */}
        <div className="md:hidden space-y-4">
          {notes.map((note) => (
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
                    className={getStatusColor(note.status)}
                    variant="default"
                  >
                    {note.status}
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
    console.error("Error fetching notes:", error);

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
            Notes
          </h1>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load notes. Please check your database connection and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}
