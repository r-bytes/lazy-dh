"use server";
import { Product } from "../types/product";

export const fetchProducts = async (queryParam?: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  let url = `${baseUrl}/api/getProducts`;

  if (queryParam) {
    url += queryParam;
  }

  try {
    const response: Response = await fetch(url, {
      next: {
        revalidate: 3600, // Revalidate every hour
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data.products as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
