"use client";

import { useState, useEffect } from "react";
import { KnowledgeHubSidebar } from "./knowledge-hub-sidebar";
import { KnowledgeHubContent } from "./knowledge-hub-content";
import { KnowledgeArticleCard } from "./knowledge-article-card";
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
 * Props for KnowledgeHubLayout component
 */
interface KnowledgeHubLayoutProps {
  articles: KnowledgeArticle[];
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
 * Knowledge Hub Layout Component
 * 
 * Manages the layout and state for the Knowledge Hub.
 * - Desktop: Sidebar + Content Pane (two columns)
 * - Mobile: Expandable Cards (single column)
 */
export function KnowledgeHubLayout({ articles }: KnowledgeHubLayoutProps) {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    articles.length > 0 ? articles[0].id : null
  );

  const selectedArticle = articles.find((a) => a.id === selectedArticleId) || null;
  const relatedArticles = selectedArticle
    ? findRelatedArticles(selectedArticle, articles)
    : [];

  // Update selected article when articles change (e.g., after filtering)
  useEffect(() => {
    if (articles.length > 0 && !articles.find((a) => a.id === selectedArticleId)) {
      setSelectedArticleId(articles[0].id);
    }
  }, [articles, selectedArticleId]);

  return (
    <>
      {/* Desktop Layout: Sidebar + Content */}
      <div className="hidden md:grid md:grid-cols-[350px_1fr] gap-6">
        {/* Left Sidebar */}
        <KnowledgeHubSidebar
          articles={articles}
          selectedArticleId={selectedArticleId}
          onArticleSelect={setSelectedArticleId}
        />

        {/* Right Content Area */}
        <KnowledgeHubContent
          article={selectedArticle}
          relatedArticles={relatedArticles}
          onArticleSelect={setSelectedArticleId}
        />
      </div>

      {/* Mobile Layout: Expandable Cards */}
      <div className="md:hidden space-y-6">
        {articles.map((article, index) => (
          <div key={article.id}>
            <KnowledgeArticleCard
              article={article}
              allArticles={articles}
            />
            {index < articles.length - 1 && (
              <Separator className="mt-6" />
            )}
          </div>
        ))}
      </div>
    </>
  );
}

