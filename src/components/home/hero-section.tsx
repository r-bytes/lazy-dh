"use client";

import { Button } from "@/components/ui/button";
import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "../../../sanity";

export interface HeroSectionProps {
  /**
   * Categories to display as badges
   */
  categories?: Category[];

  /**
   * Featured products to show in the image collage
   * Will display first 3-4 products
   */
  featuredProducts?: Product[];

  /**
   * Main heading text
   * @default "Authentieke Smaken uit Bulgarije"
   */
  title?: string;

  /**
   * Subheading/description text
   */
  subtitle?: string;

  /**
   * Primary CTA button text
   * @default "Ontdek Collectie"
   */
  primaryCtaText?: string;

  /**
   * Primary CTA link
   * @default "/categorieen"
   */
  primaryCtaLink?: string;

  /**
   * Secondary CTA button text
   * @default "Nieuwe Producten"
   */
  secondaryCtaText?: string;

  /**
   * Secondary CTA link
   * @default "/nieuwe-producten"
   */
  secondaryCtaLink?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8, x: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

/**
 * HeroSection Component
 *
 * A premium hero section with gradient background, dynamic category badges,
 * large typography, CTAs, and a product image collage on the right.
 * Includes smooth Framer Motion animations.
 *
 * @example
 * ```tsx
 * <HeroSection
 *   categories={categories}
 *   featuredProducts={products.slice(0, 4)}
 *   title="Authentieke Smaken uit Bulgarije"
 *   subtitle="Ontdek onze exclusieve collectie..."
 * />
 * ```
 */
export function HeroSection({
  categories = [],
  featuredProducts = [],
  title = "Authentieke Smaken uit Bulgarije",
  subtitle = "Ontdek onze exclusieve collectie van traditionele dranken, direct geïmporteerd voor de beste kwaliteit en smaak.",
  primaryCtaText = "Ontdek Collectie",
  primaryCtaLink = "/categorieen",
  secondaryCtaText = "Nieuwe Producten",
  secondaryCtaLink = "/nieuwe-producten",
  className,
}: HeroSectionProps) {
  // Get first 3 categories for badges (or use default badges)
  const displayBadges = categories.slice(0, 3).length > 0 
    ? categories.slice(0, 3).map((cat) => ({
        name: cat.name,
        slug: (cat as any).slug || cat.name.toLowerCase().replace(/\s+/g, "-"),
      }))
    : [
        { name: "Premium Spirits", slug: "premium" },
        { name: "Authentieke Ouzo", slug: "ouzo" },
        { name: "Traditionele Rakia", slug: "rakia" },
      ];

  // Get first 4 products for image collage
  const displayProducts = featuredProducts.slice(0, 4);

  return (
    <section
      className={cn(
        "relative min-h-[60vh] overflow-hidden sm:min-h-[70vh] lg:min-h-[92vh]",
        className
      )}
    >
      <div className="relative mx-auto flex min-h-[60vh] max-w-7xl items-center px-4 py-8 sm:min-h-[70vh] sm:px-6 sm:py-12 lg:min-h-[92vh] lg:px-8 lg:py-section-lg">
        <div className="grid w-full grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-12">
          {/* Right Column: Product Image Collage - Mobile First */}
          {displayProducts.length > 0 && (
            <motion.div
              className="relative order-first flex items-center justify-center sm:order-last sm:mt-6 lg:order-last lg:mt-0"
              variants={imageVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="relative h-[250px] w-full sm:h-[350px] lg:h-[600px]">
                {displayProducts.slice(0, 3).map((product, index) => {
                  const desktopPositions = [
                    { top: "10%", left: "10%", rotate: -15 },
                    { top: "20%", right: "10%", rotate: 10 },
                    { bottom: "20%", left: "15%", rotate: -10 },
                  ];
                  const mobilePositions = [
                    { top: "10%", left: "50%", rotate: -8 },
                    { top: "50%", right: "5%", rotate: 8 },
                    { bottom: "10%", left: "5%", rotate: -8 },
                  ];

                  const position = desktopPositions[index] || desktopPositions[0];
                  const mobilePos = mobilePositions[index] || mobilePositions[0];

                  return (
                    <motion.div
                      key={product._id}
                      className="absolute [&:nth-child(1)]:top-[10%] [&:nth-child(1)]:left-[50%] [&:nth-child(1)]:-translate-x-1/2 lg:[&:nth-child(1)]:left-[10%] lg:[&:nth-child(1)]:translate-x-0 [&:nth-child(2)]:top-[50%] [&:nth-child(2)]:right-[5%] lg:[&:nth-child(2)]:top-[20%] lg:[&:nth-child(2)]:right-[10%] [&:nth-child(3)]:bottom-[10%] [&:nth-child(3)]:left-[5%] lg:[&:nth-child(3)]:bottom-[20%] lg:[&:nth-child(3)]:left-[15%]"
                      style={{
                        top: mobilePos.top,
                        left: mobilePos.left,
                        right: mobilePos.right,
                        bottom: mobilePos.bottom,
                      }}
                      initial={{ opacity: 0, scale: 0.5, rotate: mobilePos.rotate }}
                      animate={{ opacity: 1, scale: 1, rotate: mobilePos.rotate }}
                      transition={{
                        delay: 0.3 + index * 0.2,
                        duration: 0.6,
                        ease: [0.4, 0, 0.2, 1] as const,
                      }}
                      whileHover={{
                        scale: 1.1,
                        rotate: mobilePos.rotate + 5,
                        zIndex: 10,
                        transition: { duration: 0.3 },
                      }}
                    >
                      <div className="relative h-32 w-20 sm:h-40 sm:w-24 lg:h-48 lg:w-32 xl:h-56 xl:w-40">
                        <Image
                          src={urlFor(product.image).url()}
                          alt={product.name}
                          fill
                          className="object-contain drop-shadow-2xl"
                          priority={index < 2}
                          quality={85}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Decorative glow effect */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-transparent to-transparent blur-3xl" />
            </motion.div>
          )}

          {/* Left Column: Content */}
          <motion.div
            className="flex flex-col justify-center text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badges */}
            <motion.div
              className="mb-3 flex flex-wrap justify-center gap-2 sm:mb-4 sm:justify-start sm:gap-3 lg:justify-start"
              variants={itemVariants}
            >
              {displayBadges.map((badge, index) => (
                <motion.div
                  key={badge.slug || index}
                  className="inline-flex items-center rounded-full bg-surface/30 dark:bg-surface/40 border border-border/30 px-3 py-1.5 text-xs font-semibold text-text-primary backdrop-blur-sm transition-all hover:bg-surface/40 dark:hover:bg-surface/50 sm:px-4 sm:py-2 sm:text-sm"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="mr-1.5 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                  {badge.name}
                </motion.div>
              ))}
            </motion.div>

            {/* Title */}
            <motion.h1
              className="mb-3 text-2xl font-bold leading-tight text-text-primary sm:mb-4 sm:text-3xl lg:mb-6 lg:text-4xl xl:text-5xl"
              variants={itemVariants}
            >
              {title.includes("Bulgarije") ? (
                <>
                  Authentieke Smaken uit
                  <span className="md:block text-text-secondary pl-2 md:pl-0">Bulgarije, Polen & Griekenland</span>
                </>
              ) : (
                title
              )}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mb-4 mx-auto max-w-xl text-sm text-text-secondary sm:mb-6 sm:text-base lg:mx-0 lg:mb-8 lg:text-lg"
              variants={itemVariants}
            >
              {subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3 lg:justify-start"
              variants={itemVariants}
            >
              <Button
                size="lg"
                className="group w-full bg-accent-yellow text-text-primary transition-all hover:bg-accent-yellow-dark hover:shadow-lg dark:text-black sm:w-auto"
                asChild
              >
                <Link href={primaryCtaLink} className="flex items-center justify-center">
                  {primaryCtaText}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border font-semibold hover:bg-black/10">
                <Link href={secondaryCtaLink} className="flex items-center justify-center">
                  {secondaryCtaText}
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

