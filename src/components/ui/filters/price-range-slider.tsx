"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

export interface PriceRange {
  min: number;
  max: number;
}

export interface PriceRangeSliderProps {
  /**
   * Minimum price value
   */
  minPrice: number;

  /**
   * Maximum price value
   */
  maxPrice: number;

  /**
   * Current selected range
   */
  value: PriceRange;

  /**
   * Callback when range changes
   */
  onChange: (range: PriceRange) => void;

  /**
   * Step size for slider
   * @default 0.01
   */
  step?: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * PriceRangeSlider Component
 *
 * A dual-handle slider for selecting price ranges.
 */
export function PriceRangeSlider({
  minPrice,
  maxPrice,
  value,
  onChange,
  step = 0.01,
  className,
}: PriceRangeSliderProps) {
  const [localMin, setLocalMin] = useState(value.min);
  const [localMax, setLocalMax] = useState(value.max);

  useEffect(() => {
    setLocalMin(value.min);
    setLocalMax(value.max);
  }, [value.min, value.max]);

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Math.min(Number(e.target.value), localMax - step);
      setLocalMin(newMin);
      onChange({ min: newMin, max: localMax });
    },
    [localMax, step, onChange]
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Math.max(Number(e.target.value), localMin + step);
      setLocalMax(newMax);
      onChange({ min: localMin, max: newMax });
    },
    [localMin, step, onChange]
  );

  const minPercent = ((localMin - minPrice) / (maxPrice - minPrice)) * 100;
  const maxPercent = ((localMax - minPrice) / (maxPrice - minPrice)) * 100;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Range Display */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
          € {localMin.toFixed(2)}
        </span>
        <span className="text-muted-foreground">—</span>
        <span className="font-medium">
          € {localMax.toFixed(2)}
        </span>
      </div>

      {/* Slider Container */}
      <div className="relative h-2 w-full rounded-full bg-muted">
        {/* Active Range */}
        <div
          className="absolute h-2 rounded-full bg-primary"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min Handle */}
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step={step}
          value={localMin}
          onChange={handleMinChange}
          className="absolute h-2 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all hover:[&::-webkit-slider-thumb]:scale-110 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
        />

        {/* Max Handle */}
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step={step}
          value={localMax}
          onChange={handleMaxChange}
          className="absolute h-2 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all hover:[&::-webkit-slider-thumb]:scale-110 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
        />
      </div>
    </div>
  );
}

