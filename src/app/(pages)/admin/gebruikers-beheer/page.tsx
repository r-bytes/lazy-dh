"use client";
import React, { useEffect, useState } from "react";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Corrected import for useRouter
import UserManagement from "../user-management";

interface UserManagementPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const UserManagementPage = ({ searchParams }: UserManagementPageProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Initially set to false
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Wait for session check to complete
    if (status === "loading") return; // Handle loading state
    // Check if session exists and user email is among allowed emails
    const authorizedEmails = ["rvv@duck.com", "lazodenahaag@gmail.com"];
    if (session && authorizedEmails.includes(session.user!.email!)) {
      setIsAuthenticated(true);
    } else {
      router.replace("/"); // Redirect to home if not authenticated or authorized
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="flex flex-col items-center justify-center">Loading...</div>; // Display loading indicator while session is being verified
  }

  if (!isAuthenticated) {
    // This should be a return to a simple "Access Denied" or similar page
    return <div className="flex flex-col items-center justify-center">Access Denied</div>;
  }

  return (
    <MaxWidthWrapper className="mx-auto">
      <UserManagement userIdFromProps={searchParams.token as string} />
    </MaxWidthWrapper>
  );
};

export default UserManagementPage;
