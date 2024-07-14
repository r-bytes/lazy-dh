import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

// Function to validate the JWT token structure
function isValidJwtToken(token: string): boolean {
  try {
    const decoded = jwt.decode(token);

    // Verify if decoded is a JwtPayload object
    if (typeof decoded !== "object" || decoded === null) {
      console.error("Invalid token");
      return false;
    } else if ("iat" in decoded && "exp" in decoded) {
      // Optionally, verify the token's signature here for added security
      return true;
    }
  } catch (error) {
    console.error("Decoding failed:", error);
    return false;
  }

  return false;
}

export function middleware(request: NextRequest): NextResponse {
  // const url = request.nextUrl.clone(); // Clone the NextURL object
  // const authTokenCookie = request.cookies.get("authjs.session-token");

  // // Check if the cookie exists and is valid
  // if (!authTokenCookie || !isValidJwtToken(authTokenCookie.value)) {
  //   // Construct the URL for redirection correctly
  //   const redirectUrl = new URL(url.toString()); // Create a new URL object
  //   redirectUrl.pathname = "/sign-in"; // Set the pathname to /sign-in
  //   console.log(`Redirecting to ${redirectUrl.href}`); // Log the full URL

  //   // Use rewrite for redirection with the constructed URL
  //   return NextResponse.rewrite(redirectUrl.href);
  // }

  // Continue processing the request normally
  return NextResponse.next();
}
