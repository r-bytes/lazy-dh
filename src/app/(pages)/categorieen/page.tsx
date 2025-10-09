import { CategoryCard } from "@/components/ui/category/category-card";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { fetchCategories } from "@/lib/sanity/fetchCategories";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";

async function getData(): Promise<{ categories: Category[]; products: Product[] } | null> {
  try {
    const [categories, products] = await Promise.all([fetchCategories(), fetchProducts("")]);

    if (!categories || categories.length === 0 || !products || products.length === 0) {
      console.error("No categories or products fetched");
      return null;
    }
    return { categories, products };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function Page() {
  const data = await getData();

  if (!data) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="flex w-full flex-col items-center justify-between bg-background p-6 dark:bg-gray-900 lg:p-12">
      <MaxWidthWrapper>
        <CategoryCard categories={data.categories} products={data.products} />
      </MaxWidthWrapper>
    </div>
  );
}
