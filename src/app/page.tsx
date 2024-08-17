"use server";
import { CarouselSpacing } from "@/components/products/product-carousel";
import ProductList from "@/components/products/product-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryCard } from "@/components/ui/category/category-card";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import Title from "@/components/ui/title";
import { fetchCategories } from "@/lib/sanity/fetchCategories";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { Category } from "@/lib/types/category";
import Product from "@/lib/types/product";
import Link from "next/link";

export default async function Home({ params }: { params: { user: string } }): Promise<JSX.Element> {
  // Fetching product and category data
  const productList: Product[] = await fetchProducts("");
  const categoryList: Category[] = await fetchCategories();

  // Filtering products for specific sections
  const productListInSale: Product[] = productList.filter((p) => p.inSale);
  const productListNew: Product[] = productList.filter((p) => p.isNew);

  return (
    <main className="flex flex-col items-center justify-between bg-background">
      {/* Promotions Section */}
      <section id="promotions">
        <div className="flex flex-col items-center justify-center md:mt-12">
          <Title name="Aanbiedingen" cn="text-4xl mt-6" />
          <CarouselSpacing products={productListInSale} />
          <div className="mx-auto my-16 flex justify-center">
            <Button title="Meer">
              <Link href="/promoties">Bekijk meer</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* New Products Section */}
      <section id="new">
        <Card className="mx-2 p-4 sm:mx-20 md:p-16">
          <div className="mt-24 flex flex-col items-center justify-center md:mt-32">
            <Title name="Nieuwe producten" cn="text-3xl sm:text-4xl" />
            <ProductList products={productListNew.slice(0, 4)} />
            <div className="mx-auto my-16 flex justify-center">
              <Button title="Meer">
                <Link href="/nieuwe-producten">Bekijk meer</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Categories Section */}
      <section id="categories">
        <MaxWidthWrapper className="my-12 max-w-[84rem] sm:my-24">
          <CategoryCard categories={categoryList} products={productList} slug="home" />
        </MaxWidthWrapper>
      </section>
    </main>
  );
}
