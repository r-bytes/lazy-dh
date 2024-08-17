import { CarouselSpacing } from "@/components/products/product-carousel";
import ProductList from "@/components/products/product-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryCard } from "@/components/ui/category/category-card";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import Title from "@/components/ui/title";
import Link from "next/link";

const Home = async ({ params }: { params: { user: string } }): Promise<JSX.Element> => {
  return (
    <main className="flex flex-col items-center justify-between bg-background">
      <section id="promotions">
        <div className="flex flex-col items-center justify-center md:mt-12">
          <Title name="Aanbiedingen" cn="text-4xl mt-6" />
          <CarouselSpacing />
          <div className="mx-auto my-16 flex justify-center">
            <Button title="Meer">
              <Link href={"/promoties"}>Bekijk meer</Link>
            </Button>
          </div>
        </div>
      </section>
      <section id="new">
        <Card className="mx-2 px-4 sm:mx-20 md:px-16">
          <div className="mt-2 flex flex-col items-center justify-center md:mt-32">
            <Title name="Nieuwe producten" cn="text-3xl sm:text-4xl" />
            <ProductList slug={"home"} />
            <div className="mx-auto my-16 flex justify-center">
              <Button title="Meer">
                <Link href={"/nieuwe-producten"}>Bekijk meer</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
      <section id="categories">
        <MaxWidthWrapper className="my-12 max-w-[84rem] sm:my-24">
          <CategoryCard slug={"home"} />
        </MaxWidthWrapper>
      </section>
    </main>
  );
};

export default Home;
