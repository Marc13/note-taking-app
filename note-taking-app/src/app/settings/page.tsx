"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { toast } from "sonner";
import { AlertCircle, Download, Trash2, ArrowLeft } from "lucide-react";

const settingsFormSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters").optional().or(z.literal("")),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  timezone: z.string(),
  language: z.string(),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  dailySummary: z.boolean(),
  taskReminders: z.boolean(),
  dateFormat: z.string(),
  timeFormat: z.string(),
  firstDayOfWeek: z.string(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

const timezones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
];

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ja", label: "Japanese" },
  { value: "zh", label: "Chinese" },
];

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      displayName: "John Doe",
      email: "john.doe@example.com",
      timezone: "America/New_York",
      language: "en",
      emailNotifications: true,
      pushNotifications: false,
      dailySummary: true,
      taskReminders: true,
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12-hour",
      firstDayOfWeek: "sunday",
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Settings data:", data);

    setIsLoading(false);
    toast.success("Settings saved successfully!", {
      description: "Your preferences have been updated.",
    });
  };

  const handleExportAllData = () => {
    // Export all data including settings
    const exportDate = new Date();
    const data = {
      settings: form.getValues(),
      notes: [
        {
          id: "1",
          title: "Sample Note 1",
          content: "This is a sample note from your export",
          category: "Work",
          tags: ["important", "review"],
          isPinned: false,
          createdAt: exportDate.toISOString(),
          updatedAt: exportDate.toISOString(),
        },
        {
          id: "2",
          title: "Sample Note 2",
          content: "Another sample note with different content",
          category: "Personal",
          tags: ["ideas"],
          isPinned: true,
          createdAt: exportDate.toISOString(),
          updatedAt: exportDate.toISOString(),
        }
      ],
      tasks: [
        {
          id: "1",
          title: "Sample Task 1",
          description: "This is a sample task",
          status: "pending",
          priority: "high",
          dueDate: exportDate.toISOString(),
          createdAt: exportDate.toISOString(),
        },
        {
          id: "2",
          title: "Sample Task 2",
          description: "Another sample task",
          status: "completed",
          priority: "medium",
          dueDate: exportDate.toISOString(),
          createdAt: exportDate.toISOString(),
        }
      ],
      projects: [
        {
          id: "1",
          name: "Sample Project",
          description: "This is a sample project from your export",
          status: "in-progress",
          startDate: exportDate.toISOString(),
          createdAt: exportDate.toISOString(),
        }
      ],
      categories: [
        {
          id: "1",
          name: "Work",
          color: "#0046FF",
          noteCount: 5,
        },
        {
          id: "2",
          name: "Personal",
          color: "#73C8D2",
          noteCount: 3,
        }
      ],
      exportDate: exportDate.toISOString(),
      version: "1.0.0",
      itemCount: {
        notes: 2,
        tasks: 2,
        projects: 1,
        categories: 2,
      }
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const filename = `all-data-export-${dateStr}.json`;

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("All data exported successfully!", {
      description: `File saved as ${filename}`,
    });
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText.toUpperCase() !== "DELETE") {
      toast.error("Confirmation failed", {
        description: 'Please type "DELETE" to confirm',
      });
      return;
    }

    // Placeholder delete functionality
    console.log("Deleting account...");
    setShowDeleteDialog(false);
    setDeleteConfirmText("");

    toast.success("Account deletion initiated", {
      description: "You will be logged out shortly.",
    });
  };

  return (
    <div className="min-h-screen bg-app-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <Link href="/">
            <Button variant="ghost" className="mb-4 -ml-2 text-xs sm:text-sm">
              <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Manage your account and preferences
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* User Preferences Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold">User Preferences</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your display name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="your.email@example.com" 
                          aria-required="true"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Timezone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timezones.map((tz) => (
                            <SelectItem key={tz} value={tz}>
                              {tz}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Separator />

            {/* Notification Settings Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold">Notifications</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium">Email Notifications</FormLabel>
                        <FormDescription className="text-sm text-gray-600 dark:text-gray-400">
                          Receive notifications via email
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pushNotifications"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium">Push Notifications</FormLabel>
                        <FormDescription className="text-sm text-gray-600 dark:text-gray-400">
                          Receive push notifications in your browser
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dailySummary"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium">Daily Summary</FormLabel>
                        <FormDescription className="text-sm text-gray-600 dark:text-gray-400">
                          Get a daily summary of your tasks and notes
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taskReminders"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div className="space-y-1">
                        <FormLabel className="text-sm font-medium">Task Reminders</FormLabel>
                        <FormDescription className="text-sm text-gray-600 dark:text-gray-400">
                          Receive reminders for upcoming tasks
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Separator />

            {/* Account Settings Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold">Account Settings</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Configure your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="dateFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Date Format</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select date format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Time Format</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="12-hour">12-hour</SelectItem>
                          <SelectItem value="24-hour">24-hour</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firstDayOfWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">First Day of Week</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select first day of week" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sunday">Sunday</SelectItem>
                          <SelectItem value="monday">Monday</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
                className="bg-primary-blue hover:bg-blue-600 text-white"
                size="lg"
              >
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </form>
        </Form>

        <Separator />

        {/* Danger Zone Section */}
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400">
              Danger Zone
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <AlertDescription className="text-xs sm:text-sm">
                This action cannot be undone. Please be certain before proceeding.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-2 sm:gap-3">
              <Button
                variant="outline"
                onClick={handleExportAllData}
                className="border-gray-300 dark:border-gray-600 text-sm w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Export All Data
              </Button>

              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="bg-red-600 hover:bg-red-700 text-sm w-full"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Warning:</strong> All your notes, tasks, projects, and settings will be permanently deleted.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="delete-confirm" className="text-sm font-medium">
                Type <span className="font-bold">DELETE</span> to confirm (not case-sensitive)
                <span className="text-red-500"> *</span>
              </Label>
              <Input
                id="delete-confirm"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="delete"
                aria-required="true"
                className="font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeleteConfirmText("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText.toUpperCase() !== "DELETE"}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

