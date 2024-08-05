import { Category } from "@/lib/types/category";
import { groq } from "next-sanity";
import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "../../../../sanity";

type Data = {
  categories: Category[];
};

const query: string = groq`
  *[_type == "category"] | order(order asc)
`;

export const GET = async (req: NextRequest): Promise<NextResponse<Data>> => {
  const categories: Category[] = await sanityClient.fetch(query);

  const response = NextResponse.json({ categories });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
};

export const OPTIONS = async (): Promise<NextResponse> => {
  const headers = new Headers();
  headers.append("Access-Control-Allow-Origin", "*");
  headers.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.append("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return new NextResponse(null, { status: 204, headers });
};
