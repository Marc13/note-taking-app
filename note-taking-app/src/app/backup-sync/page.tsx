"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Download, Upload, CheckCircle, Loader2, AlertCircle, Cloud, ArrowLeft, FileText } from "lucide-react";
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from "docx";
import { saveAs } from "file-saver";

type BackupItem = {
  id: string;
  date: string;
  timestamp: Date;
  size: string;
};

type SyncStatus = "connected" | "syncing" | "not-connected" | "error";

export default function BackupSyncPage() {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("connected");
  const [lastSynced, setLastSynced] = useState<Date>(new Date(2025, 0, 15, 15, 45));
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Placeholder backup history data
  const [backupHistory] = useState<BackupItem[]>([
    { id: "1", date: "January 20, 2025 at 2:30 PM", timestamp: new Date(2025, 0, 20, 14, 30), size: "2.4 MB" },
    { id: "2", date: "January 18, 2025 at 10:15 AM", timestamp: new Date(2025, 0, 18, 10, 15), size: "2.3 MB" },
    { id: "3", date: "January 15, 2025 at 3:45 PM", timestamp: new Date(2025, 0, 15, 15, 45), size: "2.2 MB" },
  ]);

  const handleExportData = () => {
    // Create sample export data
    const exportDate = new Date();
    const data = {
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
    const filename = `backup-${dateStr}.json`;

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Data exported successfully!", {
      description: `File saved as ${filename}`,
    });
  };

  const handleExportDataAsDocx = async () => {
    const exportDate = new Date();
    
    // Create document sections
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: "Data Export - My Notes App",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Export Date: ${exportDate.toLocaleDateString()} ${exportDate.toLocaleTimeString()}`,
                italics: true,
              }),
            ],
            spacing: { after: 400 },
          }),

          // Notes Section
          new Paragraph({
            text: "Notes",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Sample Note 1",
                bold: true,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "This is a sample note from your export",
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Category: ",
                bold: true,
              }),
              new TextRun("Work"),
              new TextRun("  |  "),
              new TextRun({
                text: "Tags: ",
                bold: true,
              }),
              new TextRun("important, review"),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Sample Note 2",
                bold: true,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "Another sample note with different content",
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Category: ",
                bold: true,
              }),
              new TextRun("Personal"),
              new TextRun("  |  "),
              new TextRun({
                text: "Tags: ",
                bold: true,
              }),
              new TextRun("ideas"),
              new TextRun("  |  "),
              new TextRun({
                text: "Pinned",
                italics: true,
              }),
            ],
            spacing: { after: 400 },
          }),

          // Tasks Section
          new Paragraph({
            text: "Tasks",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Sample Task 1",
                bold: true,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "This is a sample task",
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Status: ",
                bold: true,
              }),
              new TextRun("Pending"),
              new TextRun("  |  "),
              new TextRun({
                text: "Priority: ",
                bold: true,
              }),
              new TextRun("High"),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Sample Task 2",
                bold: true,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "Another sample task",
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Status: ",
                bold: true,
              }),
              new TextRun("Completed"),
              new TextRun("  |  "),
              new TextRun({
                text: "Priority: ",
                bold: true,
              }),
              new TextRun("Medium"),
            ],
            spacing: { after: 400 },
          }),

          // Projects Section
          new Paragraph({
            text: "Projects",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Sample Project",
                bold: true,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "This is a sample project from your export",
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Status: ",
                bold: true,
              }),
              new TextRun("In Progress"),
            ],
            spacing: { after: 400 },
          }),

          // Categories Section
          new Paragraph({
            text: "Categories",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Work",
                bold: true,
              }),
              new TextRun(" - 5 notes"),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Personal",
                bold: true,
              }),
              new TextRun(" - 3 notes"),
            ],
            spacing: { after: 400 },
          }),

          // Summary
          new Paragraph({
            text: "Export Summary",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: "Total Items:",
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "• Notes: 2",
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: "• Tasks: 2",
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: "• Projects: 1",
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: "• Categories: 2",
            spacing: { after: 50 },
          }),
        ],
      }],
    });

    // Generate and save the document
    const blob = await Packer.toBlob(doc);
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const filename = `backup-${dateStr}.docx`;
    
    saveAs(blob, filename);

    toast.success("Data exported as Word document!", {
      description: `File saved as ${filename}`,
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/json") {
        toast.error("Invalid file type", {
          description: "Please select a JSON file",
        });
        return;
      }
      setSelectedFile(file);
      setShowImportDialog(true);
    }
  };

  const handleImportConfirm = async () => {
    if (!selectedFile) return;

    try {
      const text = await selectedFile.text();
      const data = JSON.parse(text);
      
      // Placeholder: Would validate and import data here
      console.log("Importing data:", data);
      
      setShowImportDialog(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Data imported successfully!", {
        description: "Your backup has been restored",
      });
    } catch (error) {
      toast.error("Import failed", {
        description: "Invalid backup file format",
      });
    }
  };

  const handleDownloadBackup = (backup: BackupItem) => {
    // Create sample backup data
    const data = {
      notes: [
        {
          id: "1",
          title: "Sample Note 1",
          content: "This is a sample note from your backup",
          category: "Work",
          tags: ["important", "review"],
          isPinned: false,
          createdAt: backup.timestamp.toISOString(),
          updatedAt: backup.timestamp.toISOString(),
        },
        {
          id: "2",
          title: "Sample Note 2",
          content: "Another sample note with different content",
          category: "Personal",
          tags: ["ideas"],
          isPinned: true,
          createdAt: backup.timestamp.toISOString(),
          updatedAt: backup.timestamp.toISOString(),
        }
      ],
      tasks: [
        {
          id: "1",
          title: "Sample Task 1",
          description: "This is a sample task",
          status: "pending",
          priority: "high",
          dueDate: backup.timestamp.toISOString(),
          createdAt: backup.timestamp.toISOString(),
        },
        {
          id: "2",
          title: "Sample Task 2",
          description: "Another sample task",
          status: "completed",
          priority: "medium",
          dueDate: backup.timestamp.toISOString(),
          createdAt: backup.timestamp.toISOString(),
        }
      ],
      projects: [
        {
          id: "1",
          name: "Sample Project",
          description: "This is a sample project from your backup",
          status: "in-progress",
          startDate: backup.timestamp.toISOString(),
          createdAt: backup.timestamp.toISOString(),
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
      backupDate: backup.timestamp.toISOString(),
      backupId: backup.id,
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

    // Format the date for filename
    const date = backup.timestamp;
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const filename = `backup-${dateStr}.json`;

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Backup downloaded successfully!", {
      description: `File saved as ${filename}`,
    });
  };

  const getSyncStatusBadge = () => {
    switch (syncStatus) {
      case "connected":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="mr-1 h-3 w-3" />
            Connected
          </Badge>
        );
      case "syncing":
        return (
          <Badge className="bg-blue-500 text-white">
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Syncing
          </Badge>
        );
      case "not-connected":
        return (
          <Badge variant="secondary" className="bg-gray-400 text-white">
            <Cloud className="mr-1 h-3 w-3" />
            Not Connected
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive">
            <AlertCircle className="mr-1 h-3 w-3" />
            Error
          </Badge>
        );
    }
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Backup & Sync
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Manage your data backups and sync
          </p>
        </div>

        {/* Export Data Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold">Export Data</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Download all your data in your preferred format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 sm:gap-3">
              <Button
                onClick={handleExportData}
                className="bg-primary-blue hover:bg-blue-600 text-white text-sm w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Export as JSON
              </Button>
              <Button
                onClick={handleExportDataAsDocx}
                variant="outline"
                className="border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white text-sm w-full"
              >
                <FileText className="mr-2 h-4 w-4" />
                Export as Word (.docx)
              </Button>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Import Data Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold">Import Data</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Upload a backup file to restore data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="default" className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
              <AlertDescription className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200">
                This will replace existing data. Please ensure you have a current backup before importing.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="file-upload" className="text-xs sm:text-sm font-medium">
                Select Backup File
              </Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  id="file-upload"
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="flex-1 text-xs sm:text-sm"
                />
                <Button variant="outline" disabled={!selectedFile} className="text-sm w-full sm:w-auto">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Backup History Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold">Backup History</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Your previous backups (maximum 10 most recent)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {backupHistory.length === 0 ? (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">No backups yet</p>
            ) : (
              <div className="space-y-3">
                {backupHistory.map((backup) => (
                  <div
                    key={backup.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4"
                  >
                    <div className="flex-1 min-w-0">
                      <time 
                        dateTime={backup.timestamp.toISOString()}
                        className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 block"
                      >
                        {backup.date}
                      </time>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Size: {backup.size}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadBackup(backup)}
                      className="text-xs sm:text-sm w-full sm:w-auto flex-shrink-0"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* Cloud Sync Status Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold">Cloud Sync</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Automatic cloud backup status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-medium">Status</span>
              {getSyncStatusBadge()}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-xs sm:text-sm font-medium">Last synced</span>
              <time 
                dateTime={lastSynced.toISOString()}
                className="text-xs sm:text-sm text-gray-600 dark:text-gray-400"
              >
                {lastSynced.toLocaleDateString("en-US", { 
                  month: "long", 
                  day: "numeric", 
                  year: "numeric" 
                })} at {lastSynced.toLocaleTimeString("en-US", { 
                  hour: "numeric", 
                  minute: "2-digit",
                  hour12: true 
                })}
              </time>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSyncStatus("syncing");
                  setTimeout(() => {
                    setSyncStatus("connected");
                    setLastSynced(new Date());
                    toast.success("Sync completed successfully!");
                  }, 2000);
                }}
                disabled={syncStatus === "syncing"}
                className="text-sm w-full sm:w-auto"
              >
                {syncStatus === "syncing" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Cloud className="mr-2 h-4 w-4" />
                    Sync Now
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Import Confirmation Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Import</DialogTitle>
            <DialogDescription>
              Are you sure? This will replace all existing data.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              File: <span className="font-medium">{selectedFile?.name}</span>
            </p>
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This action cannot be undone. All your current data will be replaced.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowImportDialog(false);
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleImportConfirm}
            >
              Yes, Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

