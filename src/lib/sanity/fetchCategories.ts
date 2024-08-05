import { Category } from "../types/category";

export const fetchCategories = async () => {
  const response: Response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getCategories`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "force-cache", // SSG
    // cache: "no-store", // SSR
    // next: {
    //     revalidate: 20, // ISR
    // },
  });

  const data = await response.json();
  
  const categories: Category[] = data.categories;

  // console.log("=====> fetching... pageInfo")
  return categories;
};
