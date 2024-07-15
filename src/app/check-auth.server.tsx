"use client";
import { navigateTo } from "@/lib/utils";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function CheckAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (!session && pathname === "/") {
        navigateTo(router, "/sign-in");
      } else if (session && pathname === "/sign-up") {
        navigateTo(router, "/sign-up");
      }
      setIsAuthenticated(session !== null);
    };

    checkAuth();
  }, []);

  // Render nothing or perform other actions based on authentication status
  return null;
}
