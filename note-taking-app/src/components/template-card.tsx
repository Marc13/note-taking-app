"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, FileText } from "lucide-react";

/**
 * Props for the TemplateCard component
 */
interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    description: string;
    content: string;
    category: string;
  };
}

/**
 * Helper function to map category to color
 */
function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    "Work": "#0046FF",
    "Personal": "#73C8D2",
    "Projects": "#FF9013",
    "Meeting": "#8B5CF6",
    "Ideas": "#10B981",
  };
  return colorMap[category] || "#6B7280";
}

/**
 * Template Card Component
 * 
 * Displays a single template with preview and use functionality.
 * Shows template name, description, category, and action buttons.
 */
export function TemplateCard({ template }: TemplateCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const categoryColor = getCategoryColor(template.category);

  return (
    <>
      <Card className="bg-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <CardTitle className="text-lg font-semibold text-foreground line-clamp-2 flex-1">
              {template.name}
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-[#0046FF]/10 hover:text-[#0046FF] flex-shrink-0"
                    aria-label={`Preview ${template.name} template`}
                    onClick={() => setIsPreviewOpen(true)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Preview</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Category Badge */}
          <Badge
            variant="outline"
            className="w-fit text-xs font-medium"
            style={{ 
              borderColor: categoryColor,
              color: categoryColor,
            }}
          >
            {template.category}
          </Badge>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-between space-y-4">
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {template.description}
          </p>

          {/* Use Template Button */}
          <Button
            asChild
            className="w-full bg-[#0046FF] hover:bg-[#0046FF]/90 text-white font-semibold"
          >
            <Link href={`/notes/new?template=${template.id}`}>
              <FileText className="h-4 w-4 mr-2" />
              Use Template
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{template.name}</DialogTitle>
            <DialogDescription>
              <Badge
                variant="outline"
                className="mt-2 text-xs font-medium"
                style={{ 
                  borderColor: categoryColor,
                  color: categoryColor,
                }}
              >
                {template.category}
              </Badge>
            </DialogDescription>
          </DialogHeader>
          
          {/* Template Content Preview */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">Template Content:</p>
              <div className="bg-white p-4 rounded border text-base leading-relaxed whitespace-pre-wrap">
                {template.content}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(false)}
              className="border-gray-300 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
            >
              Close
            </Button>
            <Button
              asChild
              className="bg-[#0046FF] hover:bg-[#0046FF]/90 shadow-md hover:shadow-lg transition-all"
            >
              <Link href={`/notes/new?template=${template.id}`}>
                <FileText className="h-4 w-4 mr-2" />
                Use Template
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

