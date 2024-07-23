import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Product as ProductType } from "@/lib/types/product";
import Product from "./product";

export function CarouselSpacing({ products, cn }: { products: ProductType[] | null; cn?: string }) {
  return (
    <Carousel className={`mt-12 max-w-96 px-1 sm:max-w-xl lg:max-w-full ${cn}`}>
      <CarouselContent className="relative px-0">
        {products?.map((prod) => (
          <CarouselItem key={prod._id} className={`basis-full sm:basis-1/2 lg:basis-1/4 ${products.length > 3 ? "lg:basis-1/4" : "lg:basis-1/3"}`}>
            <Card className="mx-auto max-w-fit border-none">
              <CardContent className="flex aspect-square items-center justify-center">
                <Product carousel product={prod} />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        {...(products && products?.length < 3 ? { disabled: true } : {})}
        disabled
        className="absolute left-0 z-10 rounded-full bg-black bg-opacity-50 p-2 text-white"
      />
      <CarouselNext
        {...(products && products?.length < 3 ? { disabled: true } : {})}
        className="absolute right-0 z-10 rounded-full bg-black bg-opacity-50 p-2 text-white"
      />
    </Carousel>
  );
}

// {...(!isHoveredOn || !isFocused ? { asChild: true } : {})}