"use server";
import { Product } from "../types/product";

export const fetchProducts = async (queryParam?: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  let url = `${baseUrl}/api/getProducts`;

  // Only append queryParam if it is truthy
  if (queryParam) {
    url += queryParam;
  }

  try {
    const response: Response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // SSR - Disable caching to always fetch fresh data.
      // next: {
      //     revalidate: 20, // ISR - Commented out because it's not needed with "no-store".
      // },
    });

    if (!response.ok) {
      // Log error or throw exception based on the status code
      console.error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      return []; // Return an empty array or throw an error based on your error handling strategy
    }

    const data = await response.json();

    const products: Product[] = data.products;
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};
