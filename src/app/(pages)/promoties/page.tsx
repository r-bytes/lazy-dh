import Promotions from "@/components/products/products-list-sale";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import Product from "@/lib/types/product";

export default async function Page() {
  const products: Product[] = await fetchProducts("?type=aanbiedingen");
 
  return products.length > 0 ?  <Promotions products={products} /> : null;
}
