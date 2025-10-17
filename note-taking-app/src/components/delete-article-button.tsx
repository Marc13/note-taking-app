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
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Props for the DeleteArticleButton component
 */
interface DeleteArticleButtonProps {
  articleId: string;
  articleTitle: string;
  action: (articleId: string) => Promise<{ error?: string } | void>;
}

/**
 * Delete Article Button Component
 * 
 * Displays a delete button with confirmation dialog.
 * Handles the delete action with loading states and error handling.
 */
export function DeleteArticleButton({
  articleId,
  articleTitle,
  action,
}: DeleteArticleButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  /**
   * Handle delete confirmation
   */
  const handleDelete = () => {
    startTransition(async () => {
      const result = await action(articleId);
      
      if (result?.error) {
        toast.error(result.error);
        setIsOpen(false);
      } else {
        toast.success("Article deleted successfully!");
        // Navigation handled by server action redirect
      }
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{articleTitle}"?
              <br />
              <span className="text-destructive font-medium">
                This action cannot be undone.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Article
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

