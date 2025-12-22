"use client";

import { DateRangePreset } from "@/types/github";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateRangeSelectorProps {
  selected: DateRangePreset;
  onChange: (preset: DateRangePreset) => void;
}

const presets: { value: DateRangePreset; label: string }[] = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
  { value: "year", label: "This Year" },
  { value: "365d", label: "365 Days" },
  { value: "all", label: "All Time" },
];

export function DateRangeSelector({ selected, onChange }: DateRangeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-lg">
      {presets.map((preset) => (
        <Button
          key={preset.value}
          variant="ghost"
          size="sm"
          onClick={() => onChange(preset.value)}
          className={cn(
            "rounded-md transition-all",
            selected === preset.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
}
