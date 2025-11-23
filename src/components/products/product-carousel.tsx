"use client";

import { Product } from "@/lib/types/product";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductCard, ProductCardVariant } from "./ProductCard";

export type ProductCarouselVariant = "default" | "minimal" | "compact";

export interface ProductCarouselProps {
  /**
   * Products to display in the carousel
   */
  products: Product[];

  /**
   * Visual variant of the carousel
   * @default "default"
   */
  variant?: ProductCarouselVariant;

  /**
   * Number of products to show per slide
   * @default 4
   */
  slidesToShow?: number;

  /**
   * Whether to enable auto-play
   * @default true
   */
  autoPlay?: boolean;

  /**
   * Auto-play interval in milliseconds
   * @default 5000
   */
  autoPlayInterval?: number;

  /**
   * Whether to show navigation arrows
   * @default true
   */
  showArrows?: boolean;

  /**
   * Whether to show pagination dots
   * @default true
   */
  showDots?: boolean;

  /**
   * Callback when a favorite is removed
   */
  onRemoveFavorite?: (productId: string) => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}

type AnimationConfig =
  | { type: "spring"; stiffness: number; damping: number }
  | { duration: number; ease: readonly [number, number, number, number] };

const VARIANT_CONFIG: {
  [K in ProductCarouselVariant]: {
    cardVariant: ProductCardVariant;
    arrowSize: string;
    iconSize: string;
    dotSize: string;
    animation: AnimationConfig;
  };
} = {
  default: {
    cardVariant: "default",
    arrowSize: "h-12 w-12",
    iconSize: "h-6 w-6",
    dotSize: "h-3 w-3",
    animation: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
  minimal: {
    cardVariant: "default",
    arrowSize: "h-10 w-10",
    iconSize: "h-5 w-5",
    dotSize: "h-2 w-2",
    animation: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
  compact: {
    cardVariant: "compact",
    arrowSize: "h-10 w-10",
    iconSize: "h-5 w-5",
    dotSize: "h-2.5 w-2.5",
    animation: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

/**
 * ProductCarousel Component
 *
 * A modern, unified carousel component for displaying products.
 * Replaces both ModernCarousel and SlideCarousel with variant support.
 *
 * @example
 * ```tsx
 * <ProductCarousel
 *   products={products}
 *   variant="default"
 *   autoPlay={true}
 *   slidesToShow={4}
 * />
 * ```
 */
export function ProductCarousel({
  products,
  variant = "default",
  slidesToShow = 4,
  autoPlay = true,
  autoPlayInterval = 5000,
  showArrows = true,
  showDots = true,
  onRemoveFavorite,
  className,
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [responsiveSlidesToShow, setResponsiveSlidesToShow] = useState(slidesToShow);

  const config = VARIANT_CONFIG[variant];

  // Responsive slides calculation based on screen size
  useEffect(() => {
    const getResponsiveSlidesToShow = () => {
      if (typeof window === "undefined") return slidesToShow;
      const width = window.innerWidth;
      if (width < 640) return 1; // mobile
      if (width < 1024) return 2; // tablet
      if (width < 1280) return 3; // desktop
      return slidesToShow; // xl and above
    };

    const handleResize = () => {
      setResponsiveSlidesToShow(getResponsiveSlidesToShow());
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [slidesToShow]);

  const actualSlidesToShow = responsiveSlidesToShow;
  const maxIndex = Math.max(0, products.length - actualSlidesToShow);
  const totalSlides = Math.ceil(products.length / actualSlidesToShow);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered || products.length <= actualSlidesToShow) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isHovered, products.length, actualSlidesToShow, maxIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? maxIndex : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  // Get visible products for current slide
  const visibleProducts = products.slice(currentIndex, currentIndex + actualSlidesToShow);

  // Responsive grid columns
  const gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  if (products.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative w-full", className)}>
      {/* Carousel Container */}
      <div
        className="relative overflow-hidden rounded-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={config.animation}
            className={cn("grid gap-6", gridCols)}
          >
            {visibleProducts.map((product, index) => (
              <motion.div
                key={`${product._id}-${currentIndex}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1] as const,
                }}
                className="flex justify-center"
              >
                <div className="w-full max-w-xs">
                  <ProductCard
                    product={product}
                    variant={config.cardVariant}
                    onRemoveFavorite={onRemoveFavorite}
                    priority={index < 2 && currentIndex === 0}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {showArrows && products.length > actualSlidesToShow && (
          <>
            <motion.button
              onClick={goToPrevious}
              className={cn(
                "absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-surface/90 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-surface sm:left-4 sm:h-12 sm:w-12",
                config.arrowSize
              )}
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              aria-label="Previous slide"
            >
              <ChevronLeft className={cn("h-5 w-5 text-text-primary sm:h-6 sm:w-6", config.iconSize)} />
            </motion.button>

            <motion.button
              onClick={goToNext}
              className={cn(
                "absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-surface/90 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-surface sm:right-4 sm:h-12 sm:w-12",
                config.arrowSize
              )}
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              aria-label="Next slide"
            >
              <ChevronRight className={cn("h-5 w-5 text-text-primary sm:h-6 sm:w-6", config.iconSize)} />
            </motion.button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {showDots && products.length > actualSlidesToShow && (
        <div className="mt-6 flex justify-center gap-2 sm:mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => {
            const slideIndex = index;
            const isActive = Math.floor(currentIndex / actualSlidesToShow) === slideIndex;

            return (
              <motion.button
                key={index}
                onClick={() => goToSlide(slideIndex * actualSlidesToShow)}
                className={cn(
                  "h-2 w-2 rounded-full transition-all duration-200 sm:h-3 sm:w-3",
                  config.dotSize,
                  isActive
                    ? "bg-text-primary scale-125"
                    : "bg-border hover:bg-text-secondary"
                )}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
