"use server";

import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/ui/category/category-card";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { fetchCategories } from "@/lib/sanity/fetchCategories";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { Category } from "@/lib/types/category";
import Product from "@/lib/types/product";
import Link from "next/link";
import Promotions from "./(pages)/promoties/page";
import { auth } from "../../auth";

export default async function Home() {
  const AANBIEDINGEN: Product[] = await fetchProducts("?type=aanbiedingen");
  const productList: Product[] = await fetchProducts("");
  const categoryList: Category[] = await fetchCategories();

  const isAuthenticated = await auth();

  console.log(isAuthenticated);

  // Conditional rendering based on session
  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background">
      <section id="categories">
        <MaxWidthWrapper className="max-w-[90rem]">
          <CategoryCard slug={"home"} products={productList} categories={categoryList} />
        </MaxWidthWrapper>
      </section>
      <section id="promotions" className="mx-20 my-20">
        <Promotions products={AANBIEDINGEN.slice(0, 4)} />
        <div className="mx-auto my-4 mb-16 flex justify-center">
          <Button title="Meer">
            <Link href={"/promoties"}>Bekijk meer</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
