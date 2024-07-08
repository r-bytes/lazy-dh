"use server";

import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import Product from "@/lib/types/product";
import Link from "next/link";
import Promotions from "./(pages)/promoties/page";
import { AssortmentCard } from "@/components/ui/assortment/card";
import { Category } from "@/lib/types/category";
import { fetchCategories } from "@/lib/sanity/fetchCategories";

export default async function Home() {
  const AANBIEDINGEN: Product[] = await fetchProducts("?type=aanbiedingen");
  const productList: Product[] = await fetchProducts("");
  const categoryList: Category[] = await fetchCategories();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background">
      <section id="acties" className="py-4">
        {/* <AssortmentCard categories={categoryList} products={productList} /> */}
        <Promotions products={AANBIEDINGEN.slice(0, 4)} />
        <div className="mx-auto my-8 flex justify-center">
          <Button title="Meer">
            <Link href={"/promoties"}>Bekijk meer</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
