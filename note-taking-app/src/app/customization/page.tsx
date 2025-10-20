"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, Sun, Moon } from "lucide-react";

export default function CustomizationPage() {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState("medium");
  const [sidebarPosition, setSidebarPosition] = useState("left");
  const [compactMode, setCompactMode] = useState(false);
  const [cardShadows, setCardShadows] = useState("subtle");
  const [isLoading, setIsLoading] = useState(false);

  const colorPalette = [
    { name: "Primary Blue", hex: "#0046FF", description: "Main accent color" },
    { name: "Accent Cyan", hex: "#73C8D2", description: "Secondary accent" },
    { name: "Background Cream", hex: "#F5F1DC", description: "Page background" },
    { name: "Warning Orange", hex: "#FF9013", description: "Alerts and warnings" },
  ];

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Apply settings (placeholder for now)
    console.log({
      theme,
      fontSize,
      sidebarPosition,
      compactMode,
      cardShadows,
    });
    
    setIsLoading(false);
    toast.success("Settings saved successfully!", {
      description: "Your customization preferences have been applied.",
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Customization
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Customize your app appearance and preferences
          </p>
        </div>

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold">Appearance</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Manage your theme settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-3 sm:p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary-blue/10 dark:bg-primary-blue/20 flex-shrink-0">
                    {theme === "dark" ? (
                      <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-primary-blue" />
                    ) : (
                      <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-primary-blue" />
                    )}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <Label htmlFor="dark-mode" className="text-sm sm:text-base font-semibold cursor-pointer block">
                      Dark Mode
                    </Label>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Toggle light and dark theme
                    </p>
                  </div>
                </div>
                <Switch
                  id="dark-mode"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  className="scale-110 sm:scale-125 flex-shrink-0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Typography Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold">Typography</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Adjust text size preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="font-size" className="text-xs sm:text-sm font-medium">
                Font Size
              </Label>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger id="font-size" className="w-full text-xs sm:text-sm">
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (14px)</SelectItem>
                  <SelectItem value="medium">Medium (16px)</SelectItem>
                  <SelectItem value="large">Large (18px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Layout Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold">Layout</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Configure layout preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs sm:text-sm font-medium">Sidebar Position</Label>
              <RadioGroup value={sidebarPosition} onValueChange={setSidebarPosition}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="left" id="sidebar-left" />
                  <Label htmlFor="sidebar-left" className="text-xs sm:text-sm font-normal cursor-pointer">
                    Left (default)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="right" id="sidebar-right" />
                  <Label htmlFor="sidebar-right" className="text-xs sm:text-sm font-normal cursor-pointer">
                    Right
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1 flex-1 min-w-0">
                <Label htmlFor="compact-mode" className="text-xs sm:text-sm font-medium">
                  Compact Mode
                </Label>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Reduce spacing for denser layout
                </p>
              </div>
              <Switch
                id="compact-mode"
                checked={compactMode}
                onCheckedChange={setCompactMode}
                className="flex-shrink-0"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-xs sm:text-sm font-medium">Card Shadows</Label>
              <RadioGroup value={cardShadows} onValueChange={setCardShadows}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="subtle" id="shadows-subtle" />
                  <Label htmlFor="shadows-subtle" className="text-xs sm:text-sm font-normal cursor-pointer">
                    Subtle
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prominent" id="shadows-prominent" />
                  <Label htmlFor="shadows-prominent" className="text-xs sm:text-sm font-normal cursor-pointer">
                    Prominent
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Color Palette Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold">Color Palette</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Your app color scheme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {colorPalette.map((color) => (
                <div
                  key={color.hex}
                  className="space-y-2"
                  aria-label={`${color.name}: ${color.description}`}
                >
                  <div
                    className="h-16 sm:h-20 w-full rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
                      {color.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {color.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSaveSettings}
            disabled={isLoading}
            aria-busy={isLoading}
            className="bg-primary-blue hover:bg-blue-600 text-white text-sm sm:text-base w-full sm:w-auto"
            size="lg"
          >
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}

