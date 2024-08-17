import Promotions from "@/components/products/products-list-sale";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import Product from "@/lib/types/product";

export default async function Page() { 
  return <Promotions isPromo={true} />;
}
