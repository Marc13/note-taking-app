"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Edit, Trash2 } from "lucide-react";
import { DeleteArticleButton } from "./delete-article-button";
import { deleteArticle } from "@/app/knowledge-hub/[id]/actions";

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
 * Props for KnowledgeHubContent component
 */
interface KnowledgeHubContentProps {
  article: KnowledgeArticle | null;
  relatedArticles: KnowledgeArticle[];
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
 * Helper function to format date
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Knowledge Hub Content Component
 * 
 * Displays the selected article's full content with related articles.
 * Shows on desktop in the right pane.
 */
export function KnowledgeHubContent({ article, relatedArticles, onArticleSelect }: KnowledgeHubContentProps) {
  if (!article) {
    return (
      <Card className="h-full hidden md:flex items-center justify-center">
        <div className="text-center p-8">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Select an Article
          </h3>
          <p className="text-muted-foreground">
            Choose an article from the sidebar to view its content
          </p>
        </div>
      </Card>
    );
  }

  const categoryColor = getCategoryColor(article.category);
  const tags = article.tags ? article.tags.split(",").map((tag) => tag.trim()) : [];

  return (
    <Card className="h-full hidden md:block">
      <ScrollArea className="h-[calc(100vh-200px)]">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-2xl font-bold text-foreground flex-1">
              {article.title}
            </CardTitle>
            
            {/* Edit and Delete Buttons */}
            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hover:bg-[#0046FF]/10 hover:text-[#0046FF] hover:border-[#0046FF]"
              >
                <Link href={`/knowledge-hub/${article.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <DeleteArticleButton
                articleId={article.id}
                articleTitle={article.title}
                action={deleteArticle}
              />
            </div>
          </div>
          
          {/* Category and Date */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Badge
              variant="outline"
              className="text-xs font-medium"
              style={{
                borderColor: categoryColor,
                color: categoryColor,
              }}
            >
              {article.category}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {formatDate(article.createdAt)}
            </span>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Article Content */}
          <div className="prose prose-sm max-w-none">
            <div className="text-base leading-relaxed whitespace-pre-wrap text-foreground">
              {article.content}
            </div>
          </div>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Related Articles
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {relatedArticles.map((relatedArticle) => {
                    const relatedCategoryColor = getCategoryColor(relatedArticle.category);
                    return (
                      <button
                        key={relatedArticle.id}
                        onClick={() => onArticleSelect(relatedArticle.id)}
                        className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                      >
                        <p className="font-medium text-sm text-foreground line-clamp-2 mb-2">
                          {relatedArticle.title}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: relatedCategoryColor,
                            color: relatedCategoryColor,
                          }}
                        >
                          {relatedArticle.category}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

