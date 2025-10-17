import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { DailyNotesCalendar } from "@/components/daily-notes-calendar";

/**
 * Page metadata for SEO
 */
export const metadata = {
  title: "Daily Notes - My Notes App",
  description: "Your daily journal entries",
};

/**
 * Daily Notes Page Component
 * 
 * Displays a calendar view of journal entries with mood indicators
 * and quick capture form for today's entry.
 */
export default async function DailyNotesPage() {
  try {
    // Fetch all daily notes ordered by date descending
    const dailyNotes = await prisma.dailyNote.findMany({
      orderBy: {
        date: "desc",
      },
    });

    // Convert dates to ISO strings for client component
    const notesWithStringDates = dailyNotes.map((note) => ({
      ...note,
      date: note.date.toISOString(),
    }));

    const hasNotes = dailyNotes.length > 0;

    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Daily Notes
          </h1>
          <p className="text-muted-foreground">
            Your daily journal entries ({dailyNotes.length} entries)
          </p>
        </div>

        {/* Empty State */}
        {!hasNotes ? (
          <Alert className="border-[#0046FF]/20 bg-[#0046FF]/5">
            <AlertDescription className="text-base">
              No journal entries yet. Start writing today!
            </AlertDescription>
          </Alert>
        ) : null}

        {/* Calendar and Entries View */}
        <DailyNotesCalendar notes={notesWithStringDates} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching daily notes:", error);

    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Daily Notes
          </h1>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load daily notes. Please check your database connection and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}

