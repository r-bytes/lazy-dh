import { Category } from "../types/category";

export const fetchCategories = async () => {
  const response: Response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getCategories`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: {
      revalidate: 3600, // Revalidate every hour
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.categories as Category[];
};
