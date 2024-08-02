"use client"
import { useAuthContext } from "@/context/AuthContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const { data: session, status } = useSession();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const { authorizedEmails } = useAuthContext();

    useEffect(() => {
      if (status === "loading") return; // Do nothing while loading
      if (!session) {
        router.replace("/api/auth/signin");
        return;
      }

      if (!authorizedEmails.includes(session.user?.email!)) {
        router.replace("/");
      } else {
        setIsAuthenticated(true);
      }
    }, [session, status, router]);

    if (status === "loading") {
      return <div className="flex flex-col items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) {
      return <p className="flex flex-col items-center justify-center">Access Denied</p>;
    }

    return <WrappedComponent {...props} session={session} />;
  };
};

export default withAuth;