import { CategoryCard } from "@/components/ui/category/category-card";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { fetchCategories } from "@/lib/sanity/fetchCategories";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { Category } from "@/lib/types/category";
import Product from "@/lib/types/product";

export default async function Page() {
  const productList: Product[] = await fetchProducts("", { cache: "no-store" });
  const categoryList: Category[] = await fetchCategories();

  return (
    <div className="mx-auto flex flex-col items-center justify-between bg-background lg:max-w-7xl lg:p-24">
      <MaxWidthWrapper>
        <CategoryCard categories={categoryList} products={productList} />
      </MaxWidthWrapper>
    </div>
  );
}
