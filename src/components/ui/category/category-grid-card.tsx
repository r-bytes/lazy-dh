"use client";

import { Category } from "@/lib/types/category";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { urlFor } from "../../../../sanity";

export interface CategoryGridCardProps {
  /**
   * Category data
   */
  category: Category;

  /**
   * Number of products in this category
   */
  productCount: number;

  /**
   * Link href for the category
   */
  href: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * CategoryGridCard Component
 *
 * Individual category card with large image, overlay gradient,
 * hover zoom effect, title, and product count.
 */
export function CategoryGridCard({
  category,
  productCount,
  href,
  className,
}: CategoryGridCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      className={cn(
        "group relative block h-full overflow-hidden rounded-card-lg bg-muted transition-all duration-300 hover:shadow-lg",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <motion.div
          className="relative h-full w-full"
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
        >
          <Image
            src={urlFor(category.image).url()}
            alt={category.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
            quality={85}
          />
        </motion.div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-surface/40 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-text-primary">
          {/* Title */}
          <h3 className="mb-2 text-2xl font-bold leading-tight sm:text-3xl">
            {category.name}
          </h3>

          {/* Product Count */}
          <p className="text-sm font-medium text-text-secondary sm:text-base">
            {productCount} {productCount === 1 ? "product" : "producten"}
          </p>
        </div>

        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 bg-primary/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Arrow Indicator */}
        <motion.div
          className="absolute right-4 top-4 rounded-full bg-surface/20 p-2 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovered ? 1 : 0.7,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
        >
          <svg
            className="h-5 w-5 text-text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.div>
      </div>
    </Link>
  );
}

