"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertTriangle } from "lucide-react";

/**
 * Task type
 */
interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  dueDate: string | null;
  completed: boolean;
  project: {
    id: string;
    name: string;
  } | null;
}

/**
 * Props for TaskList component
 */
interface TaskListProps {
  tasks: Task[];
}

/**
 * Priority badge colors
 */
const PRIORITY_COLORS = {
  LOW: { bg: "#73C8D2", text: "white" },
  MEDIUM: { bg: "#FF9013", text: "white" },
  HIGH: { bg: "#0046FF", text: "white" },
};

/**
 * Helper function to format due date
 */
function formatDueDate(dateString: string | null): {
  text: string;
  status: "overdue" | "today" | "soon" | "future" | null;
} {
  if (!dateString) return { text: "", status: null };

  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(date);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: "Overdue", status: "overdue" };
  } else if (diffDays === 0) {
    return { text: "Today", status: "today" };
  } else if (diffDays === 1) {
    return { text: "Tomorrow", status: "soon" };
  } else if (diffDays <= 3) {
    return { text: `In ${diffDays} days`, status: "soon" };
  } else {
    return {
      text: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      status: "future",
    };
  }
}

/**
 * Task List Component
 * 
 * Displays tasks with checkboxes, priority badges, and due date indicators.
 */
export function TaskList({ tasks }: TaskListProps) {
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(
    tasks.reduce((acc, task) => {
      acc[task.id] = task.completed;
      return acc;
    }, {} as Record<string, boolean>)
  );

  /**
   * Handle checkbox toggle (placeholder)
   */
  const handleToggle = (taskId: string) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
    // TODO: Implement server action in later step
    console.log("Toggling task:", taskId);
  };

  return (
    <TooltipProvider>
      <div className="space-y-3">
        {tasks.map((task) => {
          const isCompleted = checkedTasks[task.id];
          const dueInfo = formatDueDate(task.dueDate);
          const isOverdue = dueInfo.status === "overdue" && !isCompleted;

          return (
            <Card
              key={task.id}
              className={`p-4 transition-colors ${
                isCompleted ? "bg-muted/30" : "bg-white"
              } ${isOverdue ? "border-l-4 border-l-destructive" : ""}`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox with Tooltip */}
                <div className="pt-0.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-pointer">
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={isCompleted}
                          onCheckedChange={() => handleToggle(task.id)}
                          aria-label={`Mark "${task.title}" as ${isCompleted ? "incomplete" : "complete"}`}
                          className="h-5 w-5 border-2 border-gray-400 data-[state=checked]:bg-[#0046FF] data-[state=checked]:border-[#0046FF]"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{isCompleted ? "Click to mark as incomplete" : "Click to check off your list"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

              {/* Task Content */}
              <div className="flex-1 min-w-0 space-y-2">
                {/* Title */}
                <label
                  htmlFor={`task-${task.id}`}
                  className={`text-base font-medium cursor-pointer block ${
                    isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {task.title}
                </label>

                {/* Description */}
                {task.description && (
                  <p
                    className={`text-sm ${
                      isCompleted ? "text-muted-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {task.description}
                  </p>
                )}

                {/* Badges and Info */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Priority Badge */}
                  <Badge
                    style={{
                      backgroundColor: PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS].bg,
                      color: PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS].text,
                    }}
                  >
                    {task.priority}
                  </Badge>

                  {/* Due Date */}
                  {dueInfo.text && (
                    <Badge
                      variant={
                        isOverdue
                          ? "destructive"
                          : dueInfo.status === "today" || dueInfo.status === "soon"
                          ? "outline"
                          : "secondary"
                      }
                      className={
                        dueInfo.status === "today" || dueInfo.status === "soon"
                          ? "border-[#FF9013] text-[#FF9013]"
                          : ""
                      }
                    >
                      {isOverdue && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {dueInfo.text}
                    </Badge>
                  )}

                  {/* Project */}
                  {task.project && (
                    <Badge variant="outline" className="text-xs">
                      {task.project.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
    </TooltipProvider>
  );
}

