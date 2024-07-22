import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Product as ProductType } from "@/lib/types/product";
import Product from "./product";

export function CarouselSpacing({ products, cn }: { products: ProductType[] | null; cn?: string }) {
  return (
    <Carousel className="max-w-96 sm:max-w-full mt-12">
      <CarouselContent>
        {products?.map((prod) => (
          <CarouselItem key={prod._id} className={`sm:basis-1/2 sm:p-2 md:basis-1/3 ${products.length > 3 && "lg:basis-1/4"}`}>
            {/* <div className="p-1"> */}
            <Card className="mx-auto max-w-fit border-none">
              <CardContent className="flex aspect-square items-center justify-center">
                <Product carousel product={prod} />
              </CardContent>
            </Card>
            {/* </div> */}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 z-10 rounded-full bg-black bg-opacity-50 p-2 text-white" />
      <CarouselNext className="absolute right-0 z-10 rounded-full bg-black bg-opacity-50 p-2 text-white" />
    </Carousel>
  );
}
