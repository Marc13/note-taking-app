"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Article type definition
 */
interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string | null;
}

/**
 * Props for the EditArticleForm component
 */
interface EditArticleFormProps {
  article: Article;
  categories: string[];
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}

/**
 * Edit Article Form Component
 * 
 * Client-side form for editing existing knowledge base articles with
 * pre-filled data, validation, loading states, and error handling.
 */
export function EditArticleForm({ article, categories, action }: EditArticleFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  
  // Form state - initialize with article data
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);
  const [category, setCategory] = useState(article.category);
  const [tags, setTags] = useState(article.tags || "");
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!title.trim()) {
      setError("Please enter an article title");
      return;
    }

    if (!content.trim()) {
      setError("Please enter article content");
      return;
    }

    const finalCategory = isCustomCategory ? customCategory : category;
    if (!finalCategory.trim()) {
      setError("Please select or enter a category");
      return;
    }

    // Create FormData and submit
    const formData = new FormData();
    formData.append("id", article.id);
    formData.append("title", title.trim());
    formData.append("content", content.trim());
    formData.append("category", finalCategory.trim());
    formData.append("tags", tags.trim());

    startTransition(async () => {
      const result = await action(formData);
      
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success("Article updated successfully!");
        // Navigation handled by server action redirect
      }
    });
  };

  /**
   * Handle cancel action
   */
  const handleCancel = () => {
    router.push("/knowledge-hub");
  };

  /**
   * Handle category selection change
   */
  const handleCategoryChange = (value: string) => {
    if (value === "custom") {
      setIsCustomCategory(true);
      setCategory("");
    } else {
      setIsCustomCategory(false);
      setCategory(value);
      setCustomCategory("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Article Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter article title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
              required
              className="text-base"
            />
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            {!isCustomCategory ? (
              <Select
                value={category}
                onValueChange={handleCategoryChange}
                disabled={isPending}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">+ Add Custom Category</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter custom category..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  disabled={isPending}
                  required
                  className="text-base"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsCustomCategory(false);
                    setCustomCategory("");
                  }}
                  disabled={isPending}
                >
                  ← Back to existing categories
                </Button>
              </div>
            )}
          </div>

          {/* Tags Field */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              type="text"
              placeholder="Enter tags separated by commas (e.g., Tutorial, Quick Win, Important)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={isPending}
              className="text-base"
            />
            <p className="text-sm text-muted-foreground">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <Label htmlFor="content">
              Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="Enter article content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPending}
              required
              rows={15}
              className="text-base resize-y min-h-[300px]"
            />
            <p className="text-sm text-muted-foreground">
              Write your article content with proper formatting and line breaks
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Article"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

