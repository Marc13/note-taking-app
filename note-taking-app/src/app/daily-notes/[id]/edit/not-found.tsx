import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";

/**
 * Not Found Page for Edit Daily Note
 * 
 * Displayed when a daily note with the given ID doesn't exist
 */
export default function EditDailyNoteNotFound() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Link href="/daily-notes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Daily Notes
          </Link>
        </Button>
      </div>

      {/* Error Message */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Daily Note Not Found
        </h1>
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertDescription>
            The daily note you're trying to edit doesn't exist or has been deleted.
          </AlertDescription>
        </Alert>
        <div className="mt-8">
          <Button asChild className="bg-[#0046FF] hover:bg-[#0046FF]/90">
            <Link href="/daily-notes">
              Return to Daily Notes
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

