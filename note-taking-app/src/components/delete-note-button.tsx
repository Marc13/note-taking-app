"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Props for DeleteNoteButton component
 */
interface DeleteNoteButtonProps {
  noteId: string;
  noteTitle: string;
  action: (noteId: string) => Promise<{ error?: string } | void>;
}

/**
 * Delete Note Button Component
 * 
 * A client component that displays a delete button with a confirmation dialog.
 * Prevents accidental deletions by requiring user confirmation.
 */
export function DeleteNoteButton({ noteId, noteTitle, action }: DeleteNoteButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  /**
   * Handle delete confirmation
   */
  const handleDelete = () => {
    startTransition(async () => {
      const result = await action(noteId);
      if (result?.error) {
        toast.error(result.error);
        setIsDialogOpen(false);
      } else {
        // Success handled by server action redirect
        toast.success("Note deleted successfully!");
      }
    });
  };

  return (
    <>
      <Button
        variant="destructive"
        size="default"
        onClick={() => setIsDialogOpen(true)}
        disabled={isPending}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Note
      </Button>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-semibold text-foreground mb-1">{noteTitle}</p>
              <p className="text-sm text-muted-foreground">
                This note will be permanently deleted from your account.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Note
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

