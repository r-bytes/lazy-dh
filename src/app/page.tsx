"use server";

import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import Product from "@/lib/types/product";
import Link from "next/link";
import Promotions from "./(pages)/promoties/page";

export default async function Home() {
  const AANBIEDINGEN: Product[] = await fetchProducts("?type=aanbiedingen");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-background">
      <section id="acties" className="py-4">
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
