"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
 * Props for the CreateProjectForm component
 */
interface CreateProjectFormProps {
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}

/**
 * Status options with colors
 */
const STATUSES = [
  { value: "ACTIVE", label: "Active", color: "#0046FF" },
  { value: "COMPLETED", label: "Completed", color: "#10B981" },
  { value: "ON_HOLD", label: "On Hold", color: "#6B7280" },
];

/**
 * Create Project Form Component
 * 
 * Client-side form for creating new projects with
 * validation, loading states, and error handling.
 */
export function CreateProjectForm({ action }: CreateProjectFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [progress, setProgress] = useState("0");

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!name.trim()) {
      setError("Please enter a project name");
      return;
    }

    if (!status) {
      setError("Please select a status");
      return;
    }

    const progressNum = parseInt(progress);
    if (isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
      setError("Progress must be a number between 0 and 100");
      return;
    }

    // Create FormData and submit
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("status", status);
    formData.append("progress", progress);

    startTransition(async () => {
      const result = await action(formData);
      
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success("Project created successfully!");
        // Navigation handled by server action redirect
      }
    });
  };

  /**
   * Handle cancel action
   */
  const handleCancel = () => {
    router.push("/projects");
  };

  /**
   * Handle progress input change with validation
   */
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or valid numbers
    if (value === "" || /^\d+$/.test(value)) {
      const num = parseInt(value);
      if (value === "" || (num >= 0 && num <= 100)) {
        setProgress(value);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Project Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter project name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              placeholder="Describe the goals and scope of this project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
              rows={4}
              className="text-base resize-y min-h-[100px]"
            />
            <p className="text-sm text-muted-foreground">
              Optional: Add details about the project objectives and deliverables
            </p>
          </div>

          {/* Status Field */}
          <div className="space-y-2">
            <Label htmlFor="status">
              Status <span className="text-destructive">*</span>
            </Label>
            <Select
              value={status}
              onValueChange={setStatus}
              disabled={isPending}
              required
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      {s.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Progress Field */}
          <div className="space-y-2">
            <Label htmlFor="progress">
              Initial Progress (%)
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                placeholder="0"
                value={progress}
                onChange={handleProgressChange}
                disabled={isPending}
                className="text-base w-32"
              />
              <span className="text-sm text-muted-foreground">
                {progress}% complete
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Optional: Set the starting progress (0-100). You can update this later.
            </p>
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
                "Create Project"
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

