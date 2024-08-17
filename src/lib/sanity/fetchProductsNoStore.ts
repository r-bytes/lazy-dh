"use server";
import { Product } from "../types/product";

export const fetchProductsNoStore = async (queryParam?: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  let url = `${baseUrl}/api/getProducts`;

  // Only append queryParam if it is truthy
  if (queryParam) {
    url += queryParam;
    // console.log("query param found: " + url);
  }

  try {
    const response: Response = await fetch(url!, {
      cache: "no-store", // SSR
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