"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useState, useTransition } from "react";

/**
 * Props for the KnowledgeHubFilters component
 */
interface KnowledgeHubFiltersProps {
  categories: string[];
  tags: string[];
  currentTag?: string;
}

/**
 * Knowledge Hub Filters Component
 * 
 * Provides search, category filter, and tag filter controls for the knowledge hub.
 * Uses client-side routing to update URL parameters for filtering.
 */
export function KnowledgeHubFilters({ categories, tags, currentTag }: KnowledgeHubFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

  /**
   * Handle search input changes
   */
  const handleSearch = (value: string) => {
    setSearchValue(value);
    
    const params = new URLSearchParams();
    
    // Preserve other params
    const currentCategory = searchParams.get("category");
    const currentTag = searchParams.get("tag");
    
    if (currentCategory && currentCategory !== "all") {
      params.set("category", currentCategory);
    }
    if (currentTag && currentTag !== "all") {
      params.set("tag", currentTag);
    }
    
    // Set search param
    if (value.trim()) {
      params.set("search", value.trim());
    }
    
    const newUrl = `/knowledge-hub${params.toString() ? `?${params.toString()}` : ''}`;
    
    startTransition(() => {
      router.push(newUrl);
    });
  };

  /**
   * Handle category filter changes
   */
  const handleCategoryFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    
    startTransition(() => {
      router.push(`/knowledge-hub?${params.toString()}`);
    });
  };

  /**
   * Handle tag filter selection
   */
  const handleTagFilter = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tag", tag);
    
    startTransition(() => {
      router.push(`/knowledge-hub?${params.toString()}`);
    });
  };

  /**
   * Clear tag filter
   */
  const clearTagFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tag");
    
    startTransition(() => {
      router.push(`/knowledge-hub?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-4">
      {/* Search and Category Filter Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        {/* Search Input */}
        <div className="flex-1 min-w-0 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
          <Input
            type="text"
            placeholder="Search articles by title or content..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4 h-11 text-base w-full bg-white border-gray-300 focus:ring-2 focus:ring-[#0046FF] focus:border-[#0046FF]"
            aria-label="Search articles"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-72 flex-shrink-0">
          <Select
            value={searchParams.get("category") || "all"}
            onValueChange={handleCategoryFilter}
          >
            <SelectTrigger aria-label="Filter by category" className="h-11 bg-white border-gray-300">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tags Filter Row */}
      {tags.length > 0 && (
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Filter by tag:
          </p>
          <div className="flex flex-wrap gap-2">
            {/* "All" Tag - Always visible */}
            <Badge
              variant={!currentTag ? "default" : "outline"}
              className={
                !currentTag
                  ? "bg-[#0046FF] hover:bg-[#0046FF]/90 cursor-pointer text-white"
                  : "cursor-pointer hover:bg-[#0046FF]/10 hover:text-[#0046FF] hover:border-[#0046FF]"
              }
              onClick={clearTagFilter}
            >
              All
            </Badge>
            
            {/* Individual Tags */}
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant={currentTag === tag ? "default" : "outline"}
                className={
                  currentTag === tag
                    ? "bg-[#0046FF] hover:bg-[#0046FF]/90 cursor-pointer text-white"
                    : "cursor-pointer hover:bg-[#0046FF]/10 hover:text-[#0046FF] hover:border-[#0046FF]"
                }
                onClick={() => handleTagFilter(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

