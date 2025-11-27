"use client";

import { cn } from "@/lib/utils";
import React from "react";

export interface SectionHeaderProps {
  /**
   * Optional badge text displayed above the title
   */
  badge?: string;

  /**
   * Badge icon (React node)
   */
  badgeIcon?: React.ReactNode;

  /**
   * Main title text
   */
  title: string;

  /**
   * Optional description/subtitle
   */
  description?: string;

  /**
   * Alignment of header content
   * @default "center"
   */
  align?: "left" | "center" | "right";

  /**
   * Title size variant
   * @default "lg"
   */
  titleSize?: "sm" | "md" | "lg" | "xl";

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Optional action button/CTA
   */
  action?: React.ReactNode;
}

const TITLE_SIZE_CLASSES = {
  sm: "text-xl sm:text-2xl lg:text-3xl",
  md: "text-2xl sm:text-3xl lg:text-4xl",
  lg: "text-2xl sm:text-3xl lg:text-4xl xl:text-5xl",
  xl: "text-3xl sm:text-4xl lg:text-5xl xl:text-6xl",
};

const ALIGN_CLASSES = {
  left: "text-left items-start",
  center: "text-center items-center",
  right: "text-right items-end",
};

/**
 * SectionHeader Component
 *
 * A standardized header component for sections with badge, title, description, and optional action.
 * Provides consistent typography and spacing across all sections.
 *
 * @example
 * ```tsx
 * <SectionHeader
 *   badge="Premium"
 *   title="Our Products"
 *   description="Discover our exclusive collection"
 *   action={<Button>View All</Button>}
 * />
 * ```
 */
export function SectionHeader({
  badge,
  badgeIcon,
  title,
  description,
  align = "center",
  titleSize = "lg",
  className,
  action,
}: SectionHeaderProps) {
  const alignClass = ALIGN_CLASSES[align];
  const titleSizeClass = TITLE_SIZE_CLASSES[titleSize];

  return (
    <div className={cn("mb-6 flex flex-col sm:mb-8 lg:mb-12", alignClass, className)}>
      {/* Badge */}
      {badge && (
        <div className="mb-2 inline-flex items-center justify-center sm:mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface/40 dark:bg-surface/50 border border-border/40 px-3 py-1.5 text-xs font-semibold text-text-primary sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
            {badgeIcon && <span className="flex-shrink-0">{badgeIcon}</span>}
            {badge}
          </span>
        </div>
      )}

      {/* Title */}
      <h2 className={cn("mb-2 font-bold text-foreground sm:mb-3", titleSizeClass)}>{title}</h2>

      {/* Description */}
      {description && (
        <p className="w-full mx-auto max-w-xl text-sm text-text-secondary sm:text-base lg:text-lg">{description}</p>
      )}

      {/* Action */}
      {action && <div className="mt-4 sm:mt-5 lg:mt-6">{action}</div>}
    </div>
  );
}

