"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2 } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreateCategoryFormProps {
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-[#0046FF] hover:bg-[#0046FF]/90 text-white font-semibold"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Creating...
        </>
      ) : (
        <>
          <Save className="h-4 w-4 mr-2" />
          Create Category
        </>
      )}
    </Button>
  );
}

const DEFAULT_COLORS = [
  { name: "Blue", value: "#0046FF" },
  { name: "Teal", value: "#73C8D2" },
  { name: "Orange", value: "#FF9013" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Green", value: "#10B981" },
  { name: "Red", value: "#EF4444" },
  { name: "Pink", value: "#EC4899" },
  { name: "Yellow", value: "#F59E0B" },
];

export function CreateCategoryForm({ action }: CreateCategoryFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#0046FF");
  const [customColor, setCustomColor] = useState<string>("#0046FF");
  const [useCustom, setUseCustom] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    // Set the final color value
    formData.set("color", useCustom ? customColor : selectedColor);
    const result = await action(formData);
    if (result && result.error) {
      setError(result.error);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Category Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g., Work, Personal, Ideas..."
          required
          className="text-base"
          maxLength={50}
        />
        <p className="text-xs text-muted-foreground">
          Choose a descriptive name for your category
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe what this category is for..."
          rows={3}
          className="text-base resize-y"
          maxLength={200}
        />
        <p className="text-xs text-muted-foreground">
          Add a brief description to help remember what this category is for
        </p>
      </div>

      {/* Color Selection */}
      <div className="space-y-3">
        <Label>
          Color <span className="text-destructive">*</span>
        </Label>
        
        {/* Preset Colors */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Choose a preset color:</p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {DEFAULT_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => {
                  setSelectedColor(color.value);
                  setUseCustom(false);
                }}
                className={`
                  relative w-12 h-12 rounded-lg transition-all
                  ${!useCustom && selectedColor === color.value 
                    ? 'ring-2 ring-offset-2 ring-[#0046FF] scale-110' 
                    : 'hover:scale-105'
                  }
                `}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {!useCustom && selectedColor === color.value && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-xl">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Color Picker */}
        <div className="space-y-2 pt-2">
          <p className="text-sm text-muted-foreground">Or pick a custom color:</p>
          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  setUseCustom(true);
                }}
                className="w-16 h-12 cursor-pointer"
              />
              <Input
                type="text"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  setUseCustom(true);
                }}
                placeholder="#0046FF"
                className="w-28 font-mono text-sm"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
            {useCustom && (
              <div
                className="w-12 h-12 rounded-lg border-2 border-white shadow-md ring-2 ring-offset-2 ring-[#0046FF]"
                style={{ backgroundColor: customColor }}
              />
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">Preview:</p>
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: useCustom ? customColor : selectedColor }}
            />
            <span className="text-sm text-muted-foreground font-mono">
              {useCustom ? customColor : selectedColor}
            </span>
          </div>
        </div>
      </div>

      {/* Hidden input for color */}
      <input type="hidden" name="color" value={useCustom ? customColor : selectedColor} />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 pt-4">
        <SubmitButton />
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

