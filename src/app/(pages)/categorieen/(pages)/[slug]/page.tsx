import ProductList from "@/components/products/product-list";
import { CardHeader } from "@/components/ui/card";
import { ProductsWithFilter } from "@/components/ui/category/products-with-filter";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import Title from "@/components/ui/title";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { fetchProductsNoStore } from "@/lib/sanity/fetchProductsNoStore";
import { capitalizeFirstLetter } from "@/lib/utils";

type Props = {
  params: { slug: string };
};

const page = async ({ params: { slug } }: Props) => {
  const products = await fetchProductsNoStore("");
  const FilteredProducts = products.filter(product => {
    if (slug === "nieuw") {
      return product.isNew
    } else if (slug === "aanbiedingen") {
      return product.inSale;
    } else if (slug === product.category) {
      return product;
    }
  })

  return slug === "alles" ? (
    <MaxWidthWrapper className="mx-auto">
      <ProductsWithFilter products={products!} />
    </MaxWidthWrapper>
  ) : (
    <div className="flex h-full flex-col">
      <Title name={capitalizeFirstLetter(slug)} />
      <ProductList products={FilteredProducts} />
    </div>
  );
};
export default page;
