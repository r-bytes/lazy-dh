import { Category } from "@/lib/types/category";
import { groq } from "next-sanity";
import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "../../../../sanity";

type Data = {
  categories: Category[];
};

export const GET = async (req: NextRequest): Promise<NextResponse<Data>> => {
  const categories: Category[] = await sanityClient.fetch(query);
  return NextResponse.json({ categories });
};

const query: string = groq`
  *[_type == "category"] | order(order asc)
`;
