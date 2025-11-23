"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface FilterChip {
  id: string;
  label: string;
  value: string;
}

export interface FilterChipsProps {
  /**
   * Active filter chips to display
   */
  chips: FilterChip[];

  /**
   * Callback when a chip is removed
   */
  onRemove: (chipId: string) => void;

  /**
   * Callback to clear all filters
   */
  onClearAll?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * FilterChips Component
 *
 * Displays active filters as removable chips.
 */
export function FilterChips({
  chips,
  onRemove,
  onClearAll,
  className,
}: FilterChipsProps) {
  if (chips.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {chips.map((chip) => (
        <div
          key={chip.id}
          className="inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1.5 text-sm"
        >
          <span className="font-medium">{chip.label}:</span>
          <span className="text-muted-foreground">{chip.value}</span>
          <button
            type="button"
            onClick={() => onRemove(chip.id)}
            className="ml-1 rounded-full p-0.5 transition-colors hover:bg-muted-foreground/20"
            aria-label={`Remove ${chip.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      {onClearAll && chips.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-auto px-2 py-1 text-xs"
        >
          Clear All
        </Button>
      )}
    </div>
  );
}

