"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState, useTransition } from "react";

/**
 * Props for the TemplateFilters component
 */
interface TemplateFiltersProps {
  categories: string[];
}

/**
 * Template Filters Component
 * 
 * Provides search and category filter controls for the templates page.
 * Uses client-side routing to update URL parameters for filtering.
 */
export function TemplateFilters({ categories }: TemplateFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

  /**
   * Handle search input changes with debouncing
   */
  const handleSearch = (value: string) => {
    setSearchValue(value);
    
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    
    startTransition(() => {
      router.push(`/templates?${params.toString()}`);
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
      router.push(`/templates?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch">
      {/* Search Input */}
      <div className="flex-1 min-w-0 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
        <Input
          type="text"
          placeholder="Search templates by name or description..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-4 h-11 text-base w-full bg-white border-gray-300 focus:ring-2 focus:ring-[#0046FF] focus:border-[#0046FF]"
          aria-label="Search templates"
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
  );
}

