import { AssortmentCard } from "@/components/ui/assortment/card";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { fetchCategories } from "@/lib/sanity/fetchCategories";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";

// async function calculateProductCounts(categories: Category[], products: Product[]) {
//   const vodkaOrOuzoCategories = categories.filter((category) => ["Vodka", "Ouzo"].includes(category.name));

//   console.log(
//    vodkaOrOuzoCategories.forEach(async (category) => {
//     const matchingProducts = products.filter((product) => product.category === category.name);
//     category.productCount = matchingProducts.length;

//   }));
// }

export default async function Page() {
  const categoryList: Category[] = await fetchCategories();
  const productList: Product[] = await fetchProducts();

  // await calculateProductCounts(categoryList, productList)

  return (
    <div className="mx-auto flex min-h-screen flex-col items-center justify-between bg-background lg:max-w-7xl lg:p-24">
      <MaxWidthWrapper>
        <AssortmentCard categories={categoryList} products={productList} />
      </MaxWidthWrapper>
    </div>
  );
}
