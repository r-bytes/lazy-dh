import Promotions from "@/components/products/products-list-sale";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import Product from "@/lib/types/product";

export default async function Page() {
  const productList: Product[] = await fetchProducts("?type=aanbiedingen");
 
  return <Promotions products={productList} />;
}
