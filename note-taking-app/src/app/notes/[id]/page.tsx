import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Edit, Trash2, ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { Note, NoteStatus } from "@prisma/client";

// Helper function to format dates
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
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

interface NoteDetailPageProps {
  params: {
    id: string;
  };
}

// Generate metadata for the note
export async function generateMetadata({ params }: NoteDetailPageProps) {
  try {
    const note = await prisma.note.findUnique({
      where: { id: params.id },
      select: {
        title: true,
        content: true,
      },
    });

    if (!note) {
      return {
        title: "Note Not Found - My Notes App",
        description: "The requested note could not be found.",
      };
    }

    const description = note.content.length > 150 
      ? note.content.substring(0, 150) + "..." 
      : note.content;

    return {
      title: `${note.title} - My Notes App`,
      description,
    };
  } catch (error) {
    return {
      title: "Note - My Notes App",
      description: "View your note details",
    };
  }
}

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
  try {
    // Fetch the note with all related data
    const note = await prisma.note.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // If note doesn't exist, return 404
    if (!note) {
      notFound();
    }

    // Fetch related notes (same category or shared tags)
    const relatedNotes = await prisma.note.findMany({
      where: {
        AND: [
          { id: { not: note.id } }, // Exclude current note
          {
            OR: [
              // Same category
              note.categoryId ? { categoryId: note.categoryId } : { categoryId: null },
              // Shared tags
              {
                tags: {
                  some: {
                    tagId: {
                      in: note.tags.map(nt => nt.tagId),
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    });

    const createdAt = new Date(note.createdAt);
    const updatedAt = new Date(note.updatedAt);
    const isUpdated = updatedAt.getTime() !== createdAt.getTime();

    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
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
                <Link href="/notes">Notes</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{note.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back to Notes Button */}
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/notes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Notes
            </Link>
          </Button>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Note Header */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {note.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <Badge
                  className={getStatusColor(note.status)}
                  variant="default"
                >
                  {note.status}
                </Badge>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>Created: {formatDate(createdAt)}</span>
              {isUpdated && <span>Updated: {formatDate(updatedAt)}</span>}
              {note.category && (
                <Badge variant="outline" className="text-xs">
                  {note.category.name}
                </Badge>
              )}
            </div>

            {/* Tags */}
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {note.tags.map((noteTag) => (
                  <Badge key={noteTag.tag.id} variant="secondary" className="text-xs">
                    {noteTag.tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Note Content */}
          <Card className="bg-white shadow-md">
            <CardContent className="p-6">
              <div className="prose prose-gray max-w-none">
                <div 
                  className="whitespace-pre-wrap text-foreground leading-relaxed"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {note.content}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white font-semibold"
            >
              <Link href={`/notes/${note.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Note
              </Link>
            </Button>
            <Button variant="destructive" size="default">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Note
            </Button>
          </div>

          {/* Related Notes Section */}
          {relatedNotes.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                Related Notes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedNotes.map((relatedNote) => (
                  <Card key={relatedNote.id} className="bg-white shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">
                        <Link
                          href={`/notes/${relatedNote.id}`}
                          className="text-foreground hover:text-[#0046FF] transition-colors line-clamp-2"
                        >
                          {relatedNote.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          className={getStatusColor(relatedNote.status)}
                          variant="default"
                        >
                          {relatedNote.status}
                        </Badge>
                        {relatedNote.category && (
                          <Badge variant="outline" className="text-xs">
                            {relatedNote.category.name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {relatedNote.content.length > 100 
                          ? relatedNote.content.substring(0, 100) + "..." 
                          : relatedNote.content}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {relatedNote.tags.slice(0, 2).map((noteTag) => (
                          <Badge key={noteTag.tag.id} variant="secondary" className="text-xs">
                            {noteTag.tag.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching note:", error);

    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load note. Please check your database connection and try again.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link href="/notes">Back to Notes</Link>
          </Button>
        </div>
      </div>
    );
  }
}
