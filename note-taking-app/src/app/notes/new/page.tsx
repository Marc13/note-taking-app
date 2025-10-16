import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { CreateNoteForm } from "@/components/create-note-form";
import { createNote } from "./actions";

export const metadata = {
  title: "Create New Note - My Notes App",
  description: "Create a new note",
};

export default async function NewNotePage() {
  // Fetch categories for the dropdown
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  // Fetch tags for selection
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });

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
            <BreadcrumbPage>New Note</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Back Button */}
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/notes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notes
          </Link>
        </Button>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Create New Note
        </h1>
        <p className="text-muted-foreground">
          Fill in the details below to create a new note
        </p>
      </div>

      {/* Create Note Form */}
      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle>Note Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateNoteForm categories={categories} tags={tags} action={createNote} />
        </CardContent>
      </Card>
    </div>
  );
}

