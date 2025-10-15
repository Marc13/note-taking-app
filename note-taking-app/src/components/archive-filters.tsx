"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState, useTransition, useEffect, useRef } from "react";

export function ArchiveFilters() {
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
        router.push(`/archive?${params.toString()}`);
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

  const handleDateFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "all") {
      params.set("dateFilter", value);
    } else {
      params.delete("dateFilter");
    }
    params.delete("page"); // Reset to page 1 on filter

    startTransition(() => {
      router.push(`/archive?${params.toString()}`);
    });
  };

  const currentDateFilter = searchParams.get("dateFilter") || "all";

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search archived notes..."
          className="pl-10"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          aria-label="Search archived notes"
          disabled={isPending}
        />
      </div>

      {/* Date Filter */}
      <div className="flex flex-wrap gap-4">
        <Select
          key={`date-${currentDateFilter}`}
          defaultValue={currentDateFilter}
          onValueChange={handleDateFilter}
          disabled={isPending}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
