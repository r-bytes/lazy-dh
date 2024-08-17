"use server";
import { Product } from "../types/product";

export const fetchProducts = async (queryParam?: string, options?: RequestInit) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  let url = `${baseUrl}/api/getProducts`;

  if (queryParam) {
    url += queryParam;
  }

  try {
    const response: Response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: options?.cache || "default",
      ...options, // Additional options
    });

    if (!response.ok) {
      console.error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    const products: Product[] = data.products;
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};
