import Product from "@/lib/types/product";
import { groq } from "next-sanity";
import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "../../../../sanity";

type Data = {
  products: Product[];
};

export const GET = async (req: NextRequest): Promise<NextResponse<Data>> => {
  console.log('🚀 GET /api/getProducts called');
  const searchParam = req.nextUrl.searchParams.get("type");
  console.log('🔍 Search param:', searchParam);

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
    productId,
    statiegeld,
    tray
  } | order(name asc, volume asc)`;
  
  console.log('📋 Query being executed:', query);

  // First, test direct query for the specific Lavish product - ALWAYS RUN THIS
  console.log('🔍 Running direct test query for Lavish product...');
  const testQuery = groq`*[_type == "product" && _id == "product-lavish-absinthe-blue-raspberry-25cl-11pct"] {
    _id,
    name,
    statiegeld,
    tray,
    "allFields": *
  }`;
  
  try {
    const testResult = await sanityClient.fetch(testQuery, {}, { 
      next: { revalidate: 0 },
      cache: 'no-store'
    });
    console.log('✅ DIRECT TEST QUERY RESULT:', JSON.stringify(testResult, null, 2));
    if (testResult && testResult.length > 0) {
      console.log('✅ Found Lavish product with statiegeld:', testResult[0].statiegeld, 'tray:', testResult[0].tray);
      console.log('✅ All fields:', Object.keys(testResult[0]));
    } else {
      console.log('❌ Lavish product not found in test query');
    }
  } catch (error) {
    console.error('❌ Test query error:', error);
  }

  const products: Product[] = await sanityClient.fetch(query, {}, { 
    next: { revalidate: 0 },
    cache: 'no-store'
  });
  
  // Log raw products from Sanity to see what we're getting
  if (products.length > 0) {
    const lavishProduct = products.find(p => p.category === 'Lavish' || p._id === 'product-lavish-absinthe-blue-raspberry-25cl-11pct');
    if (lavishProduct) {
      console.log('RAW Lavish product from Sanity (before mapping):', JSON.stringify(lavishProduct, null, 2));
    }
  }
  
  // Don't override the values - just ensure they exist
  const productsWithDefaults = products.map(product => {
    const result: any = { ...product };
    // Only set defaults if the field is truly missing (not if it's null or has a value)
    if (!('statiegeld' in result)) {
      result.statiegeld = null;
    }
    if (!('tray' in result)) {
      result.tray = false;
    }
    return result;
  });
  
  // Log to verify fields are being fetched - check for Lavish products specifically
  const lavishProduct = productsWithDefaults.find(p => p.category === 'Lavish');
  if (lavishProduct) {
    console.log('Lavish product fields from Sanity:', {
      _id: lavishProduct._id,
      name: lavishProduct.name,
      tray: lavishProduct.tray,
      statiegeld: lavishProduct.statiegeld,
      rawProduct: products.find(p => p._id === lavishProduct._id)
    });
  }
  
  if (productsWithDefaults.length > 0) {
    console.log('Sample product fields:', {
      _id: productsWithDefaults[0]._id,
      name: productsWithDefaults[0].name,
      tray: productsWithDefaults[0].tray,
      statiegeld: productsWithDefaults[0].statiegeld
    });
  }
  
  return NextResponse.json({ products: productsWithDefaults });
};
