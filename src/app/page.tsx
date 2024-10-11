import { CarouselSpacing } from "@/components/products/product-carousel";
import ProductList from "@/components/products/product-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryCard } from "@/components/ui/category/category-card";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import Title from "@/components/ui/title";
import Link from "next/link";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { fetchCategories } from "@/lib/sanity/fetchCategories";

const Home = async ({ params }: { params: { user: string } }): Promise<JSX.Element> => {
  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchProducts()
  ]);

  return (
    <main className="flex flex-col items-center justify-between bg-background">
      <section id="promotions" className="w-full max-w-7xl my-20">
        <Card className="mx-2 px-4 sm:mx-20 md:px-16 xl:mx-12">
          <div className="mt-2 flex flex-col items-center justify-center md:mt-32">
            <Title name="Aanbiedingen" cn="text-4xl sm:text-4xl mt-16 md:mt-[-2rem]" />
            <CarouselSpacing products={products.filter((p) => p.inSale)} />
            <div className="mx-auto my-16 flex justify-center">
              <Button title="Meer" className="mb-12">
                <Link href={"/promoties"}>Bekijk meer</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
      <section id="new">
        <Card className="mx-2 px-4 sm:mx-20 md:px-16 my-20">
          <div className="mt-2 flex flex-col items-center justify-center md:mt-32">
            <Title name="Nieuwe producten" cn="text-4xl sm:text-4xl mt-16 md:mt-[-2rem]" />
            <ProductList slug={"home"} products={products} />
            <div className="mx-auto my-16 flex justify-center">
              <Button size="lg" className="mb-12">
                <Link href={"/nieuwe-producten"}>Bekijk meer</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
      <section id="categories">
        <MaxWidthWrapper className="my-12 max-w-[84rem] sm:my-24">
          <CategoryCard slug="home" categories={categories} products={products} />
        </MaxWidthWrapper>
      </section>
    </main>
  );
};

export default Home;
