"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2 } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Tag {
  id: string;
  name: string;
}

interface CreateNoteFormProps {
  categories: Category[];
  tags: Tag[];
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white font-semibold"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Creating...
        </>
      ) : (
        <>
          <Save className="h-4 w-4 mr-2" />
          Create Note
        </>
      )}
    </Button>
  );
}

export function CreateNoteForm({ categories, tags, action }: CreateNoteFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [categoryValue, setCategoryValue] = useState<string>("none");
  const [statusValue, setStatusValue] = useState<string>("DRAFT");

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await action(formData);
    if (result && result.error) {
      setError(result.error);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter note title..."
          required
          className="text-base"
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content">
          Content <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Write your note content here..."
          rows={15}
          required
          className="text-base resize-y"
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select name="categoryId" value={categoryValue} onValueChange={setCategoryValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Category</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select name="status" value={statusValue} onValueChange={setStatusValue}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label>Tags (optional)</Label>
        <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/30">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <label
                key={tag.id}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border cursor-pointer hover:bg-accent transition-colors"
              >
                <input
                  type="checkbox"
                  name="tags"
                  value={tag.id}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{tag.name}</span>
              </label>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No tags available</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 pt-4">
        <SubmitButton />
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

