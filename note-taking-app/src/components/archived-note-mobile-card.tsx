"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArchiveRestore } from "lucide-react";
import { formatDate, truncateText } from "@/lib/note-utils";

interface ArchivedNoteMobileCardProps {
  note: {
    id: string;
    title: string;
    content: string;
    updatedAt: Date | string;
    category: {
      name: string;
    } | null;
    tags: Array<{
      tag: {
        id: string;
        name: string;
      };
    }>;
  };
}

export function ArchivedNoteMobileCard({ note }: ArchivedNoteMobileCardProps) {
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);

  const handleRestore = () => {
    // TODO: Implement actual restore API call
    console.log("Restoring note:", note.id);
    setIsRestoreDialogOpen(false);
    // You would typically call an API route here to update the note status
    // and then refresh the page or update the UI optimistically
  };

  return (
    <>
      <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
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
              onClick={() => setIsRestoreDialogOpen(true)}
            >
              <ArchiveRestore className="h-4 w-4 mr-2" />
              Restore Note
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Restore Confirmation Dialog */}
      <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Restore Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore this note? It will be moved back to your active notes.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-semibold text-foreground mb-1">{note.title}</p>
              <p className="text-sm text-muted-foreground">
                {truncateText(note.content, 80)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRestoreDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#73C8D2] hover:bg-[#73C8D2]/90"
              onClick={handleRestore}
            >
              <ArchiveRestore className="h-4 w-4 mr-2" />
              Restore Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

