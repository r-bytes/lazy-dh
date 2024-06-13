import Product, { Category } from "@/lib/types/product";
import { NextApiRequest } from "next";
import { groq } from "next-sanity";
import { NextResponse } from "next/server";
import { sanityClient } from "../../../../sanity";

type Data = {
  categories: Category[];
};

export const GET = async (req: NextApiRequest): Promise<NextResponse<Data>> => {
  const categories: Category[] = await sanityClient.fetch(query);
  return NextResponse.json({ categories });
};

const query: string = groq`
  *[_type == "category"] | order(order asc)
`;
