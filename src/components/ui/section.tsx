"use client";

import { cn } from "@/lib/utils";
import React from "react";

export type SectionVariant = "default" | "light" | "dark" | "gradient";
export type SectionSpacing = "sm" | "md" | "lg";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Visual variant of the section
   * @default "default"
   */
  variant?: SectionVariant;

  /**
   * Vertical spacing (padding)
   * @default "md"
   */
  spacing?: SectionSpacing;

  /**
   * Container size constraint
   * @default "xl"
   */
  container?: "sm" | "md" | "lg" | "xl" | "full";

  /**
   * Whether to add horizontal padding
   * @default true
   */
  padded?: boolean;
}

const VARIANT_CLASSES: Record<SectionVariant, string> = {
  default: "bg-background",
  light: "bg-background-alt",
  dark: "bg-surface",
  gradient: "bg-hero-light dark:bg-hero-dark",
};

const SPACING_CLASSES: Record<SectionSpacing, string> = {
  sm: "py-6 sm:py-8 lg:py-12",
  md: "py-8 sm:py-12 lg:py-16",
  lg: "py-12 sm:py-16 lg:py-24",
};

const CONTAINER_CLASSES: Record<NonNullable<SectionProps["container"]>, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

/**
 * Section Component
 *
 * A standardized section wrapper with consistent spacing, backgrounds, and container constraints.
 * Provides a foundation for all page sections with design system tokens.
 *
 * @example
 * ```tsx
 * <Section variant="light" spacing="lg">
 *   <SectionHeader badge="Premium" title="Our Products" />
 *   <div>Content here</div>
 * </Section>
 * ```
 */
export function Section({
  variant = "default",
  spacing = "md",
  container = "xl",
  padded = true,
  className,
  children,
  ...props
}: SectionProps) {
  const variantClass = VARIANT_CLASSES[variant];
  const spacingClass = SPACING_CLASSES[spacing];
  const containerClass = CONTAINER_CLASSES[container];
  const paddingClass = padded ? "px-4 sm:px-6 lg:px-8" : "";

  return (
    <section className={cn(variantClass, spacingClass, className)} {...props}>
      <div className={cn("mx-auto", containerClass, paddingClass)}>{children}</div>
    </section>
  );
}

