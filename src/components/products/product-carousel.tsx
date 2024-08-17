"use client";

import { CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { fetchProductsNoStore } from "@/lib/sanity/fetchProductsNoStore";
import { Product as ProductType } from "@/lib/types/product";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import Product from "./product";

export function CarouselSpacing({ products, cn }: { products?: ProductType[]; cn?: string }) {
  const [fetchedProducts, setFetchedProducts] = useState<ProductType[] | null>(null);
  const autoplay = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  useEffect(() => {
    const loadProducts = async () => {
      if (!products) {
        const productList: ProductType[] = await fetchProductsNoStore("");
        const productListInSale: ProductType[] = productList.filter((p) => p.inSale);
        setFetchedProducts(productListInSale);
      }
    };
    loadProducts();
  }, [products]);

  const displayedProducts = products || fetchedProducts;

  return (
    <Carousel
      className={`mt-12 max-w-96 px-4 sm:max-w-2xl sm:px-10 lg:max-w-5xl xl:max-w-7xl ${cn}`}
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
    >
      <CarouselContent className="relative px-0">
        {displayedProducts?.map((prod) => (
          <CarouselItem
            key={prod._id}
            className={`flex basis-full items-center justify-center sm:block sm:basis-1/2 lg:p-0 ${
              displayedProducts.length > 3 ? "lg:basis-1/4" : "lg:basis-1/3"
            }`}
          >
            <CardContent className="flex aspect-square items-center justify-center p-0 sm:mx-4">
              <Product carousel product={prod} />
            </CardContent>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-[-12px] hidden rounded-full bg-black bg-opacity-20 p-2 text-white sm:block" />
      <CarouselNext className="right-[-8px] hidden rounded-full bg-black bg-opacity-20 p-2 text-white sm:block" />
    </Carousel>
  );
}
