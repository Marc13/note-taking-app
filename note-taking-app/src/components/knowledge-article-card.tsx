"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
 * Props for the KnowledgeArticleCard component
 */
interface KnowledgeArticleCardProps {
  article: KnowledgeArticle;
  allArticles: KnowledgeArticle[];
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
 * Helper function to find related articles
 * Articles are related if they share the same category or have common tags
 */
function findRelatedArticles(
  currentArticle: KnowledgeArticle,
  allArticles: KnowledgeArticle[]
): KnowledgeArticle[] {
  const currentTags = currentArticle.tags
    ? currentArticle.tags.split(",").map((tag) => tag.trim())
    : [];

  const relatedArticles = allArticles
    .filter((article) => article.id !== currentArticle.id)
    .map((article) => {
      let relevanceScore = 0;

      // Same category = 2 points
      if (article.category === currentArticle.category) {
        relevanceScore += 2;
      }

      // Shared tags = 1 point each
      const articleTags = article.tags
        ? article.tags.split(",").map((tag) => tag.trim())
        : [];
      const commonTags = currentTags.filter((tag) => articleTags.includes(tag));
      relevanceScore += commonTags.length;

      return { article, relevanceScore };
    })
    .filter((item) => item.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5)
    .map((item) => item.article);

  return relatedArticles;
}

/**
 * Knowledge Article Card Component
 * 
 * Displays a knowledge article with expandable content and related articles.
 * Shows article title, category, tags, content, and creation date.
 */
export function KnowledgeArticleCard({ article, allArticles }: KnowledgeArticleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryColor = getCategoryColor(article.category);
  const tags = article.tags
    ? article.tags.split(",").map((tag) => tag.trim())
    : [];

  const relatedArticles = findRelatedArticles(article, allArticles);

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-foreground flex-1">
              {article.title}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-shrink-0"
              aria-label={isExpanded ? "Collapse article" : "Expand article"}
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Category and Date */}
          <div className="flex flex-wrap items-center gap-3">
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
            <div className="flex flex-wrap gap-2">
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
        </div>
      </CardHeader>

      {isExpanded && (
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {relatedArticles.map((relatedArticle) => {
                    const relatedCategoryColor = getCategoryColor(relatedArticle.category);
                    return (
                      <a
                        key={relatedArticle.id}
                        href={`#article-${relatedArticle.id}`}
                        className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors"
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
                      </a>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}

