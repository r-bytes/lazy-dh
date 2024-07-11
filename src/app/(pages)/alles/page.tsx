import { AssortmentCard } from "@/components/ui/assortment/card";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { fetchCategories } from "@/lib/sanity/fetchCategories";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { Category } from "@/lib/types/category";
import ProductList from "@/components/products/product-list";
import Product from "@/lib/types/product";

export default async function Page() {
  const productList: Product[] = await fetchProducts("");

  return (
    <div className="mx-auto flex min-h-screen flex-col items-center justify-between bg-background lg:max-w-7xl lg:p-24">
      <MaxWidthWrapper>
        <ProductList products={productList} />
      </MaxWidthWrapper>
    </div>
  );
}
