import Product from "@/lib/types/product";
import { groq } from "next-sanity";
import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "../../../../sanity";

type Data = {
  products: Product[];
};

export const GET = async (req: NextRequest): Promise<NextResponse<Data>> => {
  const products: Product[] = await sanityClient.fetch(query);
  return NextResponse.json({ products });
};

const query: string = groq`
  *[_type == "product"] | order(order desc)
`;
