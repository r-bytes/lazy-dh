"use server";

import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/ui/category/category-card";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { fetchCategories } from "@/lib/sanity/fetchCategories";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { Category } from "@/lib/types/category";
import Product from "@/lib/types/product";
import Link from "next/link";

import { CarouselSpacing } from "@/components/products/product-carousel";
import { CardTitle } from "@/components/ui/card";
import TestEmailButton from "@/components/TestEmailButton";

export default async function Home() {
  const productList: Product[] = await fetchProducts("");
  const categoryList: Category[] = await fetchCategories();
  const productListInSale: Product[] = productList.filter((p) => p.inSale);

  return (
    <main className="flex flex-col items-center justify-between bg-background">
      <section id="promotions">
        <div className="flex flex-col items-center justify-center">
          <CardTitle className="text-center text-4xl md:text-5xl">{"Aanbiedingen"}</CardTitle>
          <CarouselSpacing products={productListInSale!} />
          <div className="mx-auto my-16 flex justify-center">
            <Button title="Meer">
              <Link href={"/promoties"}>Bekijk meer</Link>
            </Button>
          </div>
        </div>
      </section>
      <section id="categories">
        <MaxWidthWrapper className="max-w-[84rem] mb-24">
          <CategoryCard slug={"home"} products={productList} categories={categoryList!} />
        </MaxWidthWrapper>
      </section>
    </main>
  );
}
