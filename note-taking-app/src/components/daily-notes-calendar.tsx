"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * Daily Note type
 */
interface DailyNote {
  id: string;
  date: string; // ISO string
  content: string;
  mood: string;
}

/**
 * Props for DailyNotesCalendar component
 */
interface DailyNotesCalendarProps {
  notes: DailyNote[];
}

/**
 * Mood configuration with emojis and colors
 */
const MOODS = {
  Happy: { emoji: "😊", color: "#10B981" },
  Productive: { emoji: "💪", color: "#0046FF" },
  Neutral: { emoji: "😐", color: "#6B7280" },
  Tired: { emoji: "😴", color: "#FF9013" },
  Energized: { emoji: "⚡", color: "#FBBF24" },
  Focused: { emoji: "🎯", color: "#0046FF" },
  Stressed: { emoji: "😰", color: "#EF4444" },
};

/**
 * Helper function to format date for display
 */
function formatDisplayDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Helper function to check if two dates are the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Daily Notes Calendar Component
 * 
 * Displays a calendar with highlighted dates for entries,
 * shows selected entry, and provides quick capture form.
 */
export function DailyNotesCalendar({ notes }: DailyNotesCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCreatingEntry, setIsCreatingEntry] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newMood, setNewMood] = useState<string>("Neutral");

  // Convert note dates to Date objects for comparison
  const noteDates = notes.map((note) => new Date(note.date));
  
  // Find note for selected date
  const selectedNote = notes.find((note) =>
    isSameDay(new Date(note.date), selectedDate)
  );

  // Check if today has an entry
  const todayNote = notes.find((note) => isSameDay(new Date(note.date), new Date()));

  /**
   * Handle date selection from calendar
   */
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setIsCreatingEntry(false);
    }
  };

  /**
   * Handle date input change for quick navigation
   */
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      const newDate = new Date(dateValue);
      // Add one day to correct for timezone offset
      newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
      setSelectedDate(newDate);
      setIsCreatingEntry(false);
    }
  };

  /**
   * Format date for input value (YYYY-MM-DD)
   */
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  /**
   * Handle form submission (placeholder)
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating entry:", { date: selectedDate, content: newContent, mood: newMood });
    // TODO: Implement server action in later step
    alert("Entry creation will be implemented in the next step!");
  };

  /**
   * Modifier for calendar to highlight dates with entries
   */
  const modifiers = {
    hasEntry: noteDates,
  };

  const modifiersStyles = {
    hasEntry: {
      backgroundColor: "#0046FF20",
      fontWeight: "bold" as const,
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Calendar */}
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-md border"
            />
          </div>

          {/* Quick Date Jump Input */}
          <div className="space-y-2">
            <Label htmlFor="date-jump" className="text-sm font-medium">
              Jump to date:
            </Label>
            <Input
              id="date-jump"
              type="date"
              value={formatDateForInput(selectedDate)}
              onChange={handleDateInput}
              className="w-full"
              aria-label="Select date to jump to"
            />
          </div>
        </CardContent>
      </Card>

      {/* Entry Display or Quick Capture Section */}
      <div className="space-y-6">
        {/* Selected Date Entry */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {formatDisplayDate(selectedDate)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedNote ? (
              <div className="space-y-4">
                {/* Mood Indicator */}
                <div className="flex items-center gap-2">
                  <Label>Mood:</Label>
                  <Badge
                    variant="outline"
                    className="text-base px-3 py-1"
                    style={{
                      borderColor: MOODS[selectedNote.mood as keyof typeof MOODS]?.color || "#6B7280",
                      color: MOODS[selectedNote.mood as keyof typeof MOODS]?.color || "#6B7280",
                    }}
                  >
                    {MOODS[selectedNote.mood as keyof typeof MOODS]?.emoji || "😐"}{" "}
                    {selectedNote.mood}
                  </Badge>
                </div>

                {/* Entry Content */}
                <div className="space-y-2">
                  <Label>Entry:</Label>
                  <div className="text-base leading-relaxed whitespace-pre-wrap p-4 bg-muted/50 rounded-md">
                    {selectedNote.content}
                  </div>
                </div>

                {/* Edit Button */}
                <Button
                  asChild
                  variant="outline"
                  className="hover:bg-[#0046FF]/10 hover:text-[#0046FF] hover:border-[#0046FF]"
                >
                  <Link href={`/daily-notes/${selectedNote.id}/edit`}>
                    Edit Entry
                  </Link>
                </Button>
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  No entry for this date. {isSameDay(selectedDate, new Date()) && "Create one below!"}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Quick Capture Form for Today */}
        {isSameDay(selectedDate, new Date()) && !todayNote && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create Today's Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Mood Selector */}
                <div className="space-y-2">
                  <Label htmlFor="mood">Mood</Label>
                  <Select value={newMood} onValueChange={setNewMood}>
                    <SelectTrigger id="mood">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(MOODS).map(([mood, { emoji }]) => (
                        <SelectItem key={mood} value={mood}>
                          {emoji} {mood}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Content Textarea */}
                <div className="space-y-2">
                  <Label htmlFor="content">What's on your mind?</Label>
                  <Textarea
                    id="content"
                    placeholder="Write about your day..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={8}
                    className="resize-y min-h-[150px]"
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white w-full"
                >
                  Save Entry
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

