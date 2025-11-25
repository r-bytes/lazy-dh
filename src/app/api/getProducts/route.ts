import Product from "@/lib/types/product";
import { groq } from "next-sanity";
import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "../../../../sanity";

type Data = {
  products: Product[];
};

export const GET = async (req: NextRequest): Promise<NextResponse<Data>> => {
  const searchParam = req.nextUrl.searchParams.get("type");

  let filterCondition = "";
  if (searchParam === "aanbiedingen") {
    filterCondition = "&& inSale == true";
  } else if (searchParam === "nieuw") {
    filterCondition = "&& isNew == true";
  } else if (searchParam === "wodka") {
    filterCondition = "&& category == 'Wodka'";
  } else if (searchParam === "ouzo") {
    filterCondition = "&& category == 'Ouzo'";
  } else if (searchParam === "whisky") {
    filterCondition = "&& category == 'Whisky'";
  } else if (searchParam === "rakia") {
    filterCondition = "&& category == 'Rakia'";
  }

  const query = groq`*[_type == "product"${filterCondition}] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    image,
    name,
    category,
    description,
    price,
    volume,
    percentage,
    land,
    inStock,
    inSale,
    isNew,
    quantityInBox,
    quantity,
    productId
  } | order(name asc, volume asc)`;

  const products: Product[] = await sanityClient.fetch(query, {}, { next: { revalidate: 3600 } });
  
  return NextResponse.json({ products });
};
