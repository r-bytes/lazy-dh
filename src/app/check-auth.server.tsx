// "use client";

// import { useEffect } from "react";
// import { getSession } from "next-auth/react";
// import { usePathname, useRouter } from "next/navigation";
// import { navigateTo } from "@/lib/utils";

// export default function CheckAuth() {
//   const pathname = usePathname();
//   const router = useRouter();

//   useEffect(() => {
//     const checkAuth = async () => {
//       const session = await getSession();
//       if (!session && pathname === "/") {
//         navigateTo(router, "/sign-in");
//       }
//     };

//     checkAuth();
//   }, []);

//   return null; // This component doesn't render anything
// }

"use client";
import { navigateTo } from "@/lib/utils";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function CheckAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (!session) {
        navigateTo(router, "/sign-in");
      }
      setIsAuthenticated(session !== null);
    };

    checkAuth();
  }, []);

  // Render nothing or perform other actions based on authentication status
  return null;
}
