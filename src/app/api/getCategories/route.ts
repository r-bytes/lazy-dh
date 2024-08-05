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

export const middleware = async (req: NextRequest) => {
  if (req.method === "OPTIONS") {
    const headers = new Headers();
    headers.append("Access-Control-Allow-Origin", "*");
    headers.append("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    headers.append("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return new Response(null, { status: 204, headers });
  }

  const response = await GET(req);
  response.headers.append("Access-Control-Allow-Origin", "*");
  response.headers.append("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.headers.append("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
};
