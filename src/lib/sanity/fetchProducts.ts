import { Product } from "../types/product";

export const fetchProducts = async () => {
  const response: Response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/getProducts`, {
    // cache: "force-cache", // SSG
    cache: "no-store", // SSR
    // next: {
    //     revalidate: 20, // ISR
    // },
  });

  const data = await response.json();
  
  const products: Product[] = data.products;

  // console.log("=====> fetching... pageInfo")
  return products;
};
