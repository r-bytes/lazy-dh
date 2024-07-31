"use client";
import React, { useEffect, useState } from "react";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import OrderManagement from "../order-management";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Assuming "authenticated" status means there is a session
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
      // Redirect if there is no session
      router.replace("/");
      return;
    }

    // Check if the user is one of the authorized emails
    const authorizedEmails = ["rvv@duck.com", "lazodenhaag@gmail.com"];
    if (authorizedEmails.includes(session.user!.email!)) {
      setIsAuthenticated(true);
    } else {
      // Redirect if the user is not authorized
      router.replace("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="flex flex-col items-center justify-center">Loading...</div>; // Show loading text while checking session
  }

  if (!isAuthenticated) {
    return <p className="flex flex-col items-center justify-center">Access Denied</p>; // Show an access denied message if not authenticated
  }

  return (
    <MaxWidthWrapper className="mx-auto">
      <OrderManagement />
    </MaxWidthWrapper>
  );
};

export default AdminPage;
