import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
      <div className="space-y-6">
        {/* Back to Notes Button */}
        <div>
          <Button asChild variant="outline" size="sm">
            <Link href="/notes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Notes
            </Link>
          </Button>
        </div>

        {/* Error Card */}
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground">
              Note Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription className="text-base">
                The note you're looking for doesn't exist or may have been deleted.
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white font-semibold">
                <Link href="/notes">View All Notes</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
