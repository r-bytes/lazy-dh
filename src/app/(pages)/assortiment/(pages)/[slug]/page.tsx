import ProductList from "@/components/products/product-list";
import { CardHeader } from "@/components/ui/card";
import { useProductContext } from "@/context/ProductContext";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import Product, { Product as ProductType } from "@/lib/types/product";
import { capitalizeFirstLetter } from "@/lib/utils";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const page = async ({ params: { slug }, searchParams }: Props) => {
  console.log(slug);

  const products = await fetchProducts();
  // Todo: optimize this?
  // const { productState: products } = useProductContext()
  return (
    <div className="flex h-screen w-screen flex-col">
      <CardHeader className="mb-10 mt-24 text-center text-2xl font-semibold sm:mt-0"> {capitalizeFirstLetter(slug)} </CardHeader>
      <ProductList products={products} />
    </div>
  );
};
export default page;
