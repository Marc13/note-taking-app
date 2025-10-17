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
import { EditDailyNoteForm } from "@/components/edit-daily-note-form";
import { updateDailyNote } from "./actions";

/**
 * Page metadata for SEO
 */
export const metadata = {
  title: "Edit Daily Note - My Notes App",
  description: "Edit your daily journal entry",
};

/**
 * Props for the Edit Daily Note page
 */
interface EditDailyNotePageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Edit Daily Note Page
 * 
 * Provides a form for editing existing daily journal entries.
 */
export default async function EditDailyNotePage({ params }: EditDailyNotePageProps) {
  try {
    const { id } = await params;

    // Fetch the daily note to edit
    const dailyNote = await prisma.dailyNote.findUnique({
      where: {
        id: id,
      },
    });

    if (!dailyNote) {
      notFound();
    }

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
            <Link href="/daily-notes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Daily Notes
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
              <BreadcrumbLink href="/daily-notes">Daily Notes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Entry</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Edit Daily Note
          </h1>
          <p className="text-muted-foreground">
            Update your journal entry
          </p>
        </div>

        {/* Edit Daily Note Form */}
        <EditDailyNoteForm
          dailyNote={dailyNote}
          action={updateDailyNote}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading edit daily note page:", error);
    
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
        <div className="mb-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/daily-notes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Daily Notes
            </Link>
          </Button>
        </div>
        
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-destructive mb-4">
            Error Loading Page
          </h2>
          <p className="text-muted-foreground">
            Unable to load the edit form. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}

