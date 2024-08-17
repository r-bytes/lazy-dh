import ProductList from "@/components/products/product-list";
import { CardHeader } from "@/components/ui/card";
import { ProductsWithFilter } from "@/components/ui/category/products-with-filter";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import Title from "@/components/ui/title";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { capitalizeFirstLetter } from "@/lib/utils";

type Props = {
  params: { slug: string };
};

const page = async ({ params: { slug } }: Props) => {
  const products = await fetchProducts(`?type=${slug.toLowerCase()}`, { cache: "no-store" });

  return slug === "alles" ? (
    <MaxWidthWrapper className="mx-auto">
      <ProductsWithFilter products={products!} />
    </MaxWidthWrapper>
  ) : (
    <div className="flex h-full flex-col">
      <Title name={capitalizeFirstLetter(slug)} />
      <ProductList products={products} />
    </div>
  );
};
export default page;
