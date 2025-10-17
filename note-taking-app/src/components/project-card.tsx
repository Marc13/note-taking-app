"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

/**
 * Project type
 */
interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  progress: number;
  createdAt: string;
  totalTasks: number;
  completedTasks: number;
}

/**
 * Props for ProjectCard component
 */
interface ProjectCardProps {
  project: Project;
}

/**
 * Status badge configuration
 */
const STATUS_CONFIG = {
  ACTIVE: { bg: "#0046FF", text: "white", label: "Active" },
  COMPLETED: { bg: "#10B981", text: "white", label: "Completed" },
  ON_HOLD: { bg: "#6B7280", text: "white", label: "On Hold" },
};

/**
 * Helper function to format date
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Project Card Component
 * 
 * Displays a project with progress bar, status badge, and task statistics.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const statusConfig = STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.ACTIVE;

  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-3 mb-2">
          <CardTitle className="text-xl font-semibold text-foreground flex-1">
            {project.name}
          </CardTitle>
          <Badge
            style={{
              backgroundColor: statusConfig.bg,
              color: statusConfig.text,
            }}
          >
            {statusConfig.label}
          </Badge>
        </div>
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Progress</span>
            <span className="font-semibold text-[#0046FF]">{project.progress}%</span>
          </div>
          <Progress
            value={project.progress}
            className="h-2"
            aria-label={`Project progress: ${project.progress}%`}
            aria-valuenow={project.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {/* Task Statistics */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tasks</span>
            <span className="font-medium text-foreground">
              {project.completedTasks} of {project.totalTasks} completed
            </span>
          </div>
        </div>

        {/* Created Date */}
        <div className="text-xs text-muted-foreground">
          Created {formatDate(project.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
}

