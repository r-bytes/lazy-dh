import ProductList from "@/components/products/product-list";
import { ProductsWithFilter } from "@/components/ui/category/products-with-filter";
import { CardHeader } from "@/components/ui/card";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { capitalizeFirstLetter } from "@/lib/utils";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const page = async ({ params: { slug }, searchParams }: Props) => {
  const products = await fetchProducts(`?type=${slug.toLowerCase()}`);

  // Todo: optimize this?
  // const { productState: products } = useProductContext()
  return slug === "alles" ? (
    <MaxWidthWrapper className="mx-auto">
      <ProductsWithFilter products={products!} />
    </MaxWidthWrapper>
  ) : (
    <div className="flex h-screen w-screen flex-col">
      <CardHeader className="mb-10 mt-24 text-center text-5xl font-semibold sm:mt-0"> {capitalizeFirstLetter(slug)} </CardHeader>
      <ProductList products={products} />
    </div>
  );
};
export default page;
