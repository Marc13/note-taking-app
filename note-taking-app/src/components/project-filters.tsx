"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

/**
 * Project Filters Component
 * 
 * Provides status filter control for the projects page.
 */
export function ProjectFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Handle filter changes
   */
  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "all") {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    
    router.push(`/projects?${params.toString()}`);
  };

  return (
    <div className="w-full sm:w-64">
      <Label htmlFor="status-filter" className="text-sm font-medium mb-2 block">
        Filter by Status
      </Label>
      <Select
        value={searchParams.get("status") || "all"}
        onValueChange={handleFilterChange}
      >
        <SelectTrigger id="status-filter">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="on-hold">On Hold</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

