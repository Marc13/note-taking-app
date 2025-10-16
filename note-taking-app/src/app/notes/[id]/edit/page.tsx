import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { EditNoteForm } from "@/components/edit-note-form";
import { updateNote } from "./actions";

/**
 * Props for the Edit Note page
 */
interface EditNotePageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Generate metadata for the edit note page
 */
export async function generateMetadata({ params }: EditNotePageProps) {
  const { id } = await params;
  const note = await prisma.note.findUnique({
    where: { id },
    select: { title: true },
  });

  return {
    title: note ? `Edit: ${note.title} - My Notes App` : "Edit Note - My Notes App",
    description: "Edit your note",
  };
}

/**
 * Edit Note Page Component
 * 
 * Allows users to edit an existing note with all its properties.
 */
export default async function EditNotePage({ params }: EditNotePageProps) {
  const { id } = await params;

  // Fetch the note with all related data
  const note = await prisma.note.findUnique({
    where: { id },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  // If note doesn't exist, show 404
  if (!note) {
    notFound();
  }

  // Fetch all categories and tags for the form
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
        color: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.tag.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    }),
  ]);

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
            <BreadcrumbLink asChild>
              <Link href={`/notes/${note.id}`}>{note.title}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Back Button */}
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href={`/notes/${note.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Note
          </Link>
        </Button>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Edit Note
        </h1>
        <p className="text-muted-foreground">
          Make changes to your note below
        </p>
      </div>

      {/* Edit Note Form */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle>Note Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditNoteForm
            note={{
              id: note.id,
              title: note.title,
              content: note.content,
              status: note.status,
              categoryId: note.categoryId,
              tagIds: note.tags.map((t) => t.tag.id),
            }}
            categories={categories}
            tags={tags}
            action={updateNote}
          />
        </CardContent>
      </Card>
    </div>
  );
}

