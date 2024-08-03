import FavoriteProductList from "@/components/products/product-list-favorite";
import { fetchProducts } from "@/lib/sanity/fetchProducts";

export default async function Page() {
  const products = await fetchProducts("");
  return products.length > 0 ? <FavoriteProductList products={products} /> : null;
}
