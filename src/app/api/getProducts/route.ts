import Product from "@/lib/types/product";
import { groq } from "next-sanity";
import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "../../../../sanity";

type Data = {
  products: Product[];
};

export const GET = async (req: NextRequest): Promise<NextResponse<Data>> => {
  const searchParam = req.nextUrl.searchParams.get("type");

  const baseQuery = '*[_type == "product"';
  const additionalCondition =
    searchParam === "aanbiedingen"
      ? "&& inSale == true]"
      : searchParam === "nieuw"
        ? "&& isNew == true]"
        : searchParam === "wodka"
          ? "&& category == 'Wodka']"
          : searchParam === "ouzo"
            ? "&& category == 'Ouzo']"
            : searchParam === "whisky"
              ? "&& category == 'Whisky']"
              : searchParam === "rakia"
                ? "&& category == 'Rakia']"
                : "]";

  const query = groq`${baseQuery} ${additionalCondition} | order(name asc, volume asc)`;

  const products: Product[] = await sanityClient.fetch(query);
  return NextResponse.json({ products });
};
