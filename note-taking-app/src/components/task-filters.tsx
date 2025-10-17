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
 * Project type
 */
interface Project {
  id: string;
  name: string;
}

/**
 * Props for TaskFilters component
 */
interface TaskFiltersProps {
  projects: Project[];
}

/**
 * Task Filters Component
 * 
 * Provides filtering and sorting controls for the tasks page.
 */
export function TaskFilters({ projects }: TaskFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Handle filter/sort changes
   */
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    router.push(`/tasks?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Completion Filter */}
      <div className="space-y-2">
        <Label htmlFor="completion-filter" className="text-sm font-medium">
          Status
        </Label>
        <Select
          value={searchParams.get("completion") || "all"}
          onValueChange={(value) => handleFilterChange("completion", value)}
        >
          <SelectTrigger id="completion-filter">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="incomplete">Incomplete</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Priority Filter */}
      <div className="space-y-2">
        <Label htmlFor="priority-filter" className="text-sm font-medium">
          Priority
        </Label>
        <Select
          value={searchParams.get("priority") || "all"}
          onValueChange={(value) => handleFilterChange("priority", value)}
        >
          <SelectTrigger id="priority-filter">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Project Filter */}
      <div className="space-y-2">
        <Label htmlFor="project-filter" className="text-sm font-medium">
          Project
        </Label>
        <Select
          value={searchParams.get("project") || "all"}
          onValueChange={(value) => handleFilterChange("project", value)}
        >
          <SelectTrigger id="project-filter">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <Label htmlFor="sort-filter" className="text-sm font-medium">
          Sort By
        </Label>
        <Select
          value={searchParams.get("sort") || "default"}
          onValueChange={(value) => handleFilterChange("sort", value)}
        >
          <SelectTrigger id="sort-filter">
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="created">Created Date</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

