"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { NoteStatus } from "@prisma/client";
import { toast } from "sonner";

/**
 * Category interface
 */
interface Category {
  id: string;
  name: string;
  color: string;
}

/**
 * Tag interface
 */
interface Tag {
  id: string;
  name: string;
}

/**
 * Note data interface
 */
interface NoteData {
  id: string;
  title: string;
  content: string;
  status: NoteStatus;
  categoryId: string | null;
  tagIds: string[];
}

/**
 * Props for EditNoteForm component
 */
interface EditNoteFormProps {
  note: NoteData;
  categories: Category[];
  tags: Tag[];
  action: (noteId: string, formData: FormData) => Promise<{ error?: string } | void>;
}

/**
 * Edit Note Form Component
 * 
 * A client component for editing existing notes.
 * Pre-fills form with current note data and handles updates.
 */
export function EditNoteForm({ note, categories, tags, action }: EditNoteFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // Form state
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    note.categoryId || undefined
  );
  const [selectedStatus, setSelectedStatus] = useState<NoteStatus>(note.status);
  const [selectedTags, setSelectedTags] = useState<string[]>(note.tagIds);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  /**
   * Handle form submission
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({}); // Clear previous errors

    const formData = new FormData();
    formData.set("title", title);
    formData.set("content", content);
    if (selectedCategory) {
      formData.set("categoryId", selectedCategory);
    }
    formData.set("status", selectedStatus);
    selectedTags.forEach((tagId) => formData.append("tags", tagId));

    startTransition(async () => {
      const result = await action(note.id, formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        // Success handled by server action redirect
        toast.success("Note updated successfully!");
      }
    });
  };

  /**
   * Handle tag selection changes
   */
  const handleTagChange = (tagId: string, checked: boolean) => {
    setSelectedTags((prev) =>
      checked ? [...prev, tagId] : prev.filter((id) => id !== tagId)
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="grid gap-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="My awesome note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPending}
          required
        />
        {errors.title && <p className="text-destructive text-sm">{errors.title[0]}</p>}
      </div>

      {/* Content */}
      <div className="grid gap-2">
        <Label htmlFor="content">
          Content <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Start writing your note here..."
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPending}
          required
        />
        {errors.content && <p className="text-destructive text-sm">{errors.content[0]}</p>}
      </div>

      {/* Category */}
      <div className="grid gap-2">
        <Label htmlFor="category">Category (Optional)</Label>
        <Popover open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isCategoryOpen}
              className="w-full justify-between"
              disabled={isPending}
            >
              {selectedCategory
                ? categories.find((category) => category.id === selectedCategory)?.name
                : "Select category..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Search category..." />
              <CommandList>
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>
                  {categories.map((category) => (
                    <CommandItem
                      key={category.id}
                      value={category.name}
                      onSelect={() => {
                        setSelectedCategory(category.id === selectedCategory ? undefined : category.id);
                        setIsCategoryOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCategory === category.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Status */}
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={selectedStatus}
          onValueChange={(value: NoteStatus) => setSelectedStatus(value)}
          disabled={isPending}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(NoteStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      <div className="grid gap-2">
        <Label>Tags (Optional)</Label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center space-x-2">
              <Checkbox
                id={`tag-${tag.id}`}
                checked={selectedTags.includes(tag.id)}
                onCheckedChange={(checked) =>
                  handleTagChange(tag.id, checked === true)
                }
                disabled={isPending}
              />
              <label
                htmlFor={`tag-${tag.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tag.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white font-semibold"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Note"
          )}
        </Button>
      </div>
    </form>
  );
}

