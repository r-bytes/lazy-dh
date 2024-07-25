"use client"

import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Product as ProductType } from "@/lib/types/product";
import Product from "./product";
import Autoplay from "embla-carousel-autoplay";

export function CarouselSpacing({ products, cn }: { products: ProductType[] | null; cn?: string }) {
  const hasEnoughItems = products && products.length >= 4;

  const autoplay = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));


  return (
    <Carousel
      className={`mt-12 max-w-96 px-4 sm:max-w-2xl sm:px-10 lg:max-w-5xl xl:max-w-7xl ${cn}`}
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
    >
      <CarouselContent className="relative px-0">
        {products?.map((prod) => (
          <CarouselItem key={prod._id} className={`basis-full sm:basis-1/2 lg:p-0 ${products.length > 3 ? "lg:basis-1/4" : "lg:basis-1/3"}`}>
            <CardContent className="flex aspect-square items-center justify-center p-0 sm:mx-4">
              <Product carousel product={prod} />
            </CardContent>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious disabled={!hasEnoughItems} className="absolute left-0 z-10 rounded-full bg-black bg-opacity-50 p-2 text-white" />
      <CarouselNext disabled={!hasEnoughItems} className="absolute right-0 z-10 rounded-full bg-black bg-opacity-50 p-2 text-white" />
    </Carousel>
  );
}