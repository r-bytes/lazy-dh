import FavoriteProductList from "@/components/products/product-list-favorite";
import { fetchProducts } from "@/lib/sanity/fetchProducts";

export default async function Page() {
  return <FavoriteProductList />;
}
