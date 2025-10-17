"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Project type
 */
interface Project {
  id: string;
  name: string;
}

/**
 * Props for the CreateTaskForm component
 */
interface CreateTaskFormProps {
  projects: Project[];
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}

/**
 * Priority options with colors
 */
const PRIORITIES = [
  { value: "LOW", label: "Low", color: "#73C8D2" },
  { value: "MEDIUM", label: "Medium", color: "#FF9013" },
  { value: "HIGH", label: "High", color: "#0046FF" },
];

/**
 * Create Task Form Component
 * 
 * Client-side form for creating new tasks with
 * validation, loading states, and error handling.
 */
export function CreateTaskForm({ projects, action }: CreateTaskFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [projectId, setProjectId] = useState("none");

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!title.trim()) {
      setError("Please enter a task title");
      return;
    }

    if (!priority) {
      setError("Please select a priority");
      return;
    }

    // Create FormData and submit
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("priority", priority);
    formData.append("dueDate", dueDate);
    formData.append("projectId", projectId);

    startTransition(async () => {
      const result = await action(formData);
      
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success("Task created successfully!");
        // Navigation handled by server action redirect
      }
    });
  };

  /**
   * Handle cancel action
   */
  const handleCancel = () => {
    router.push("/tasks");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
              required
              className="text-base"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add any additional details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              rows={4}
              className="text-base resize-y min-h-[100px]"
            />
          </div>

          {/* Priority Field */}
          <div className="space-y-2">
            <Label htmlFor="priority">
              Priority <span className="text-destructive">*</span>
            </Label>
            <Select
              value={priority}
              onValueChange={setPriority}
              disabled={isPending}
              required
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: p.color }}
                      />
                      {p.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due Date Field */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isPending}
              className="text-base"
            />
            <p className="text-sm text-muted-foreground">
              Optional: Set a deadline for this task
            </p>
          </div>

          {/* Project Field */}
          <div className="space-y-2">
            <Label htmlFor="project">Project (Optional)</Label>
            <Select
              value={projectId}
              onValueChange={setProjectId}
              disabled={isPending}
            >
              <SelectTrigger id="project">
                <SelectValue placeholder="Select a project (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Project</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Choose <span className="font-medium">"No Project"</span> or select an existing project from the list.
              </p>
              <p className="text-sm text-muted-foreground">
                Need a different project? <Link href="/projects" className="text-[#0046FF] hover:underline font-medium">Create a new project</Link> first from the Projects page.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

