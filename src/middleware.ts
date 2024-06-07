import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  let isAuth = false;

  (async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // Use environment variable for production
      const apiUrl = `${baseUrl}/api/isAuth`;

      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        console.log("first");
        isAuth = true;
        return NextResponse.next();
      } else {
        isAuth = false;
        console.log("2");
      }
    } catch (error) {
      isAuth = false;
      console.error("Failed to check authentication:", error);
    }
  })();

  setTimeout(() => {
    if (request.nextUrl.pathname.startsWith("/") && !isAuth) {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      return NextResponse.rewrite(url);
    }
  }, 1000);
}

export const config = {
  matcher: "/",
};
