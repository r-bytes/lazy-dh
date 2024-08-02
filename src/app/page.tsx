"use server";
import { sql } from "@vercel/postgres";

import { CarouselSpacing } from "@/components/products/product-carousel";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/ui/category/category-card";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import Title from "@/components/ui/title";
import { fetchCategories } from "@/lib/sanity/fetchCategories";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { Category } from "@/lib/types/category";
import Product from "@/lib/types/product";
import Link from "next/link";

export default async function Home({ params }: { params: { user: string } }): Promise<JSX.Element> {
  const productList: Product[] = await fetchProducts("");
  const categoryList: Category[] = await fetchCategories();
  const productListInSale: Product[] = productList.filter((p) => p.inSale);  

  return (
    <main className="flex flex-col items-center justify-between bg-background">
      <section id="promotions">
        <div className="flex flex-col items-center justify-center">
          <Title name="Aanbiedingen" />
          <CarouselSpacing products={productListInSale!} />
          <div className="mx-auto my-16 flex justify-center">
            <Button title="Meer">
              <Link href={"/promoties"}>Bekijk meer</Link>
            </Button>
          </div>
        </div>
      </section>
      <section id="categories">
        <MaxWidthWrapper className="my-12 max-w-[84rem] sm:my-24">
          <CategoryCard categories={categoryList} products={productList} slug={"home"} />
        </MaxWidthWrapper>
      </section>
    </main>
  );
}
