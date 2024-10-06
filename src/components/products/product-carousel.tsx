"use client";

import { CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProductsNoStore } from "@/lib/sanity/fetchProductsNoStore";
import { Product as ProductType } from "@/lib/types/product";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import Product from "./product";

export function CarouselSpacing({ products, cn }: { products?: ProductType[]; cn?: string }) {
  const [fetchedProducts, setFetchedProducts] = useState<ProductType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!products);
  const autoplay = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  useEffect(() => {
    const loadProducts = async () => {
      if (!products) {
        setIsLoading(true);
        try {
          const productList: ProductType[] = await fetchProductsNoStore("");
          const productListInSale: ProductType[] = productList.filter((p) => p.inSale);
          setFetchedProducts(productListInSale);
        } catch (error) {
          console.error("Failed to load products:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadProducts();
  }, [products]);

  const displayedProducts = products || fetchedProducts;

  return (
    <div className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <Carousel
        className={`mt-12 w-full ${cn}`}
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {isLoading
            ? [...Array(4)].map((_, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <CardContent className="flex aspect-square items-center justify-center p-0">
                    <Skeleton className="h-[32rem] w-full" />
                  </CardContent>
                </CarouselItem>
              ))
            : displayedProducts?.map((prod) => (
                <CarouselItem key={prod._id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <CardContent className="flex aspect-square items-center justify-center p-0">
                    <Product carousel product={prod} />
                  </CardContent>
                </CarouselItem>
              ))}
        </CarouselContent>

        <CarouselPrevious className="absolute left-0 sm:left-[-40px] lg:left-[-70px] rounded-full bg-black bg-opacity-20 p-2 text-white" />
        <CarouselNext className="absolute right-0 sm:right-[-40px] lg:right-[-70px] rounded-full bg-black bg-opacity-20 p-2 text-white" />
      </Carousel>
    </div>
  );
}
