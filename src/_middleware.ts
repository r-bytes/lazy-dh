// import { NextApiResponse } from "next";
// import { NextResponse, type NextRequest } from "next/server";
// import axios from "axios";

// export async function middleware(request: NextRequest) {
//   const baseUrl = "http://localhost:3000";
//   const apiUrl = `${baseUrl}/api/isAuth`;

//   const cookie = request.cookies.get("auth_session");

//   const response = await axios.request({
//     url: apiUrl,
//     method: "GET",
//   });

//   console.log(await response.data.isAuthenticated);

//   if (cookie) {
//     // compare the value to the db value
//     const res = NextResponse.next();
//     return res;
//   } else {

//     const url = request.nextUrl.clone();
//     url.pathname = "/sign-in";
//     return NextResponse.rewrite(url);
//   }
// }
