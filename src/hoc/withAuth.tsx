"use client";
import { useAuthContext } from "@/context/AuthContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  const WithAuthComponent = (props: any) => {
    const { data: session, status } = useSession();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const { authorizedEmails } = useAuthContext();
    const [color, setColor] = useState("#facc15");

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
    }, [session, status, router, authorizedEmails]);

    if (status === "loading") {
      return (
        <div className="my-32 flex items-center justify-center">
          <BeatLoader color={color} loading={true} size={20} aria-label="Loading Spinner" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return <p className="my-32 flex flex-col items-center justify-center">Access Denied</p>;
    }

    return <WrappedComponent {...props} session={session} />;
  };

  // Set the display name for debugging purposes
  WithAuthComponent.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;

  return WithAuthComponent;
};

// Helper function to get the display name of a component
const getDisplayName = (WrappedComponent: React.ComponentType<any>) => WrappedComponent.displayName || WrappedComponent.name || "Component";

export default withAuth;
