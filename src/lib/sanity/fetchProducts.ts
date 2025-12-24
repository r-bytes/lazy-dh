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
        revalidate: 0, // No cache for now
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    const products = data.products as Product[];
    
    // Ensure statiegeld and tray are always present, even if undefined from API
    const productsWithDefaults = products.map(product => {
      const result: any = { ...product };
      // Explicitly set statiegeld and tray, handling undefined, null, or missing
      if (!('statiegeld' in product) || product.statiegeld === undefined || product.statiegeld === null) {
        result.statiegeld = null;
      } else {
        result.statiegeld = product.statiegeld;
      }
      if (!('tray' in product) || product.tray === undefined || product.tray === null) {
        result.tray = false;
      } else {
        result.tray = product.tray;
      }
      return result;
    });
    
    // Log to verify fields are present
    if (productsWithDefaults.length > 0) {
      console.log('fetchProducts - Sample product:', {
        _id: productsWithDefaults[0]._id,
        name: productsWithDefaults[0].name,
        tray: productsWithDefaults[0].tray,
        statiegeld: productsWithDefaults[0].statiegeld,
        fullProduct: productsWithDefaults[0]
      });
    }
    
    return productsWithDefaults;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
