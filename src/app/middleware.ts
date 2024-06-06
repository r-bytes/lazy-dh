// pages/_middleware.ts
import { validateRequest } from "@/lib/db/auth";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { session } = await validateRequest();

  console.log(session);
  

  console.log(request);
  

  // if (!user) {
  //   return NextResponse.rewrite(new URL("/sign-in", request.nextUrl.origin));
  
  // Redirect users without a valid session or user to the sign-in page
  if (!session) {
    // Construct the URL for the rewrite. Adjust the path as needed.
    const signInURL = new URL("/sign-in", request.nextUrl.origin).toString();
    return NextResponse.rewrite(signInURL);
  }

  // if (request.nextUrl.pathname.startsWith("/dashboard")) {
  //   return NextResponse.rewrite(new URL("/dashboard/user", request.url));
  // }
}