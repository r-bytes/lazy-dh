"use server";

import ProductList from "@/components/products/product-list";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import Title from "@/components/ui/title";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { Product as ProductType } from "@/lib/types/product";
import { navigateTo } from "@/lib/utils";
import { User } from "lucia";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default async function Home() {
  const AANBIEDINGEN: ProductType[] = await fetchProducts();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background">
      <section id="acties" className="py-4">
        <Title name={"Aanbiedingen"} />
        <MaxWidthWrapper>
          <ProductList products={AANBIEDINGEN.slice(0, 4)} />
        </MaxWidthWrapper>
        <div className="mx-auto my-8 flex justify-center">
          {/* <Button onClick={() => navigateTo(router, "/assortiment/aanbiedingen")}>View More</Button> */}
        </div>
      </section>
    </main>
  );
}
