"use client";

import { CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Product as ProductType } from "@/lib/types/product";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import Product from "./product";

export function CarouselSpacing({ products }: { products: ProductType[] }) {
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  return (
    <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <Carousel
        className="w-full"
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((prod) => (
            <CarouselItem key={prod._id} className="basis-full pl-2 sm:basis-1/2 md:pl-4 lg:basis-1/3 xl:basis-1/4">
              <CardContent className="flex aspect-square items-center justify-center p-0">
                <Product carousel product={prod} />
              </CardContent>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom Navigation Buttons */}
        <CarouselPrevious className="absolute -left-12 top-1/2 hidden h-12 w-12 -translate-y-1/2 rounded-full border-0 bg-white/90 shadow-lg transition-all duration-200 hover:bg-white lg:flex">
          <ChevronLeft className="h-6 w-6 text-slate-700" />
        </CarouselPrevious>
        <CarouselNext className="absolute -right-12 top-1/2 hidden h-12 w-12 -translate-y-1/2 rounded-full border-0 bg-white/90 shadow-lg transition-all duration-200 hover:bg-white lg:flex">
          <ChevronRight className="h-6 w-6 text-slate-700" />
        </CarouselNext>

        {/* Mobile Navigation */}
        <div className="mt-6 flex justify-center lg:hidden">
          <div className="flex space-x-2">
            <CarouselPrevious className="relative h-10 w-10 rounded-full bg-slate-200 transition-colors hover:bg-slate-300">
              <ChevronLeft className="h-5 w-5 text-slate-700" />
            </CarouselPrevious>
            <CarouselNext className="relative h-10 w-10 rounded-full bg-slate-200 transition-colors hover:bg-slate-300">
              <ChevronRight className="h-5 w-5 text-slate-700" />
            </CarouselNext>
          </div>
        </div>
      </Carousel>
    </div>
  );
}
