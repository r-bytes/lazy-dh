import { Product } from "../types/product";

export const fetchProducts = async (queryParam?: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  let url = `${baseUrl}/api/getProducts`;

  // Only append queryParam if it is truthy
  if (queryParam) {
    url += queryParam;
    // console.log("query param found: " + url);
    
  }

  const response: Response = await fetch(url, {
    cache: "force-cache", // SSG
    // cache: "no-store", // SSR
    // next: {
    //     revalidate: 20, // ISR
    // },
  });

  const data = await response.json();

  const products: Product[] = data.products;

  // console.log("=====> fetching... pageInfo")
  return products;
};
