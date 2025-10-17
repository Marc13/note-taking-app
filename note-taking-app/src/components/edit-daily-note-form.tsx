"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
 * Daily Note type definition
 */
interface DailyNote {
  id: string;
  date: Date;
  content: string;
  mood: string;
}

/**
 * Props for the EditDailyNoteForm component
 */
interface EditDailyNoteFormProps {
  dailyNote: DailyNote;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}

/**
 * Mood configuration with emojis
 */
const MOODS = [
  { value: "Happy", emoji: "😊" },
  { value: "Productive", emoji: "💪" },
  { value: "Neutral", emoji: "😐" },
  { value: "Tired", emoji: "😴" },
  { value: "Energized", emoji: "⚡" },
  { value: "Focused", emoji: "🎯" },
  { value: "Stressed", emoji: "😰" },
];

/**
 * Edit Daily Note Form Component
 * 
 * Client-side form for editing daily journal entries with
 * pre-filled data, validation, loading states, and error handling.
 */
export function EditDailyNoteForm({ dailyNote, action }: EditDailyNoteFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  
  // Form state - initialize with daily note data
  const [content, setContent] = useState(dailyNote.content);
  const [mood, setMood] = useState(dailyNote.mood);

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!content.trim()) {
      setError("Please enter your journal entry");
      return;
    }

    if (!mood.trim()) {
      setError("Please select a mood");
      return;
    }

    // Create FormData and submit
    const formData = new FormData();
    formData.append("id", dailyNote.id);
    formData.append("date", dailyNote.date.toISOString());
    formData.append("content", content.trim());
    formData.append("mood", mood.trim());

    startTransition(async () => {
      const result = await action(formData);
      
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success("Daily note updated successfully!");
        // Navigation handled by server action redirect
      }
    });
  };

  /**
   * Handle cancel action
   */
  const handleCancel = () => {
    router.push("/daily-notes");
  };

  /**
   * Format date for display
   */
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Entry for {formatDate(dailyNote.date)}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Mood Field */}
          <div className="space-y-2">
            <Label htmlFor="mood">
              Mood <span className="text-destructive">*</span>
            </Label>
            <Select
              value={mood}
              onValueChange={setMood}
              disabled={isPending}
              required
            >
              <SelectTrigger id="mood">
                <SelectValue placeholder="Select your mood" />
              </SelectTrigger>
              <SelectContent>
                {MOODS.map(({ value, emoji }) => (
                  <SelectItem key={value} value={value}>
                    {emoji} {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <Label htmlFor="content">
              Entry <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              placeholder="Write about your day..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPending}
              required
              rows={15}
              className="text-base resize-y min-h-[300px]"
            />
            <p className="text-sm text-muted-foreground">
              Share your thoughts, experiences, and reflections
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
                "Update Entry"
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

