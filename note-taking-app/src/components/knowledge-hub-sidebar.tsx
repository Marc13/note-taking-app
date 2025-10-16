"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/**
 * Knowledge Article type
 */
interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string;
  createdAt: Date;
}

/**
 * Props for KnowledgeHubSidebar component
 */
interface KnowledgeHubSidebarProps {
  articles: KnowledgeArticle[];
  selectedArticleId: string | null;
  onArticleSelect: (articleId: string) => void;
}

/**
 * Helper function to map category to color
 */
function getCategoryColor(category: string): string {
  const colorMap: Record<string, string> = {
    "Documentation": "#0046FF",
    "Reference": "#73C8D2",
    "Guide": "#FF9013",
    "Support": "#8B5CF6",
    "Tutorial": "#10B981",
    "FAQ": "#EF4444",
  };
  return colorMap[category] || "#6B7280";
}

/**
 * Knowledge Hub Sidebar Component
 * 
 * Displays a list of articles in a sidebar navigation format.
 * Shows on desktop, hidden on mobile.
 */
export function KnowledgeHubSidebar({ articles, selectedArticleId, onArticleSelect }: KnowledgeHubSidebarProps) {
  return (
    <Card className="h-full hidden md:block">
      <ScrollArea className="h-[calc(100vh-200px)]">
        <CardContent className="p-0">
          <div className="space-y-1 p-2">
            {articles.map((article) => {
              const isSelected = selectedArticleId === article.id;
              const categoryColor = getCategoryColor(article.category);
              
              return (
                <button
                  key={article.id}
                  onClick={() => onArticleSelect(article.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all duration-200",
                    "hover:bg-muted/50",
                    isSelected && "bg-[#0046FF]/10 border-l-4 border-[#0046FF]"
                  )}
                  aria-current={isSelected ? "page" : undefined}
                >
                  <h3 className={cn(
                    "font-semibold text-sm line-clamp-2 mb-1",
                    isSelected ? "text-[#0046FF]" : "text-foreground"
                  )}>
                    {article.title}
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      borderColor: categoryColor,
                      color: categoryColor,
                    }}
                  >
                    {article.category}
                  </Badge>
                </button>
              );
            })}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

