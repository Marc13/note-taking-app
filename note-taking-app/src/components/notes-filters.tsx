"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState, useTransition, useEffect, useRef } from "react";

interface NotesFiltersProps {
  categories: Array<{ id: string; name: string }>;
}

export function NotesFilters({ categories }: NotesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Sync search value with URL on mount and param changes
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== searchValue) {
      setSearchValue(urlSearch);
    }
  }, [searchParams]);

  // Debounced search effect - only runs when user types
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (searchValue.trim()) {
        params.set("search", searchValue.trim());
      } else {
        params.delete("search");
      }
      params.delete("page"); // Reset to page 1 on search

      startTransition(() => {
        router.push(`/notes?${params.toString()}`);
      });
    }, 800); // 800ms debounce delay

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchValue]); // Only depend on searchValue, not searchParams

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleStatusFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "all") {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    params.delete("page"); // Reset to page 1 on filter

    startTransition(() => {
      router.push(`/notes?${params.toString()}`);
    });
  };

  const handleCategoryFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "all") {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    params.delete("page"); // Reset to page 1 on filter

    startTransition(() => {
      router.push(`/notes?${params.toString()}`);
    });
  };

  const currentStatus = searchParams.get("status") || "all";
  const currentCategory = searchParams.get("category") || "all";

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search notes..."
          className="pl-10"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          aria-label="Search notes"
          disabled={isPending}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select
          key={`status-${currentStatus}`}
          defaultValue={currentStatus}
          onValueChange={handleStatusFilter}
          disabled={isPending}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select
          key={`category-${currentCategory}`}
          defaultValue={currentCategory}
          onValueChange={handleCategoryFilter}
          disabled={isPending}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}