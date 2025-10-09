"use client";

import { Product as ProductType } from "@/lib/types/product";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Product from "./product";

interface SlideCarouselProps {
  products: ProductType[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function SlideCarousel({ products, autoPlay = true, autoPlayInterval = 5000 }: SlideCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === products.length - 1 ? 0 : prevIndex + 1));
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isHovered, products.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? products.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === products.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {products.slice(currentIndex, currentIndex + 4).map((product, index) => (
                <motion.div
                  key={`${product._id}-${currentIndex}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                  className="flex justify-center"
                >
                  <div className="w-full max-w-xs">
                    <Product carousel product={product} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <motion.button
          onClick={goToPrevious}
          className="group absolute left-4 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-white/95 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white"
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ChevronLeft className="h-7 w-7 text-slate-700 transition-colors group-hover:text-slate-900" />
        </motion.button>

        <motion.button
          onClick={goToNext}
          className="group absolute right-4 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-white/95 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white"
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ChevronRight className="h-7 w-7 text-slate-700 transition-colors group-hover:text-slate-900" />
        </motion.button>
      </div>

      {/* Dots Indicator */}
      <div className="mt-8 flex justify-center space-x-3">
        {Array.from({ length: Math.max(1, products.length - 3) }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-4 w-4 rounded-full transition-all duration-300 ${
              index === currentIndex ? "scale-125 bg-slate-900 shadow-lg" : "bg-slate-300 hover:scale-110 hover:bg-slate-500"
            }`}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
          />
        ))}
      </div>
    </div>
  );
}
