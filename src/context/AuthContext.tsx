"use client";

import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState, useCallback } from "react";

type ContextProps = {
  user: User | null;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  isAdminApproved: boolean;
  setIsAdminApproved: Dispatch<SetStateAction<boolean>>;
  checkAdminApproval: (email: string) => Promise<void>;
  authorizedEmails: string[];
};

export const AuthContext = createContext<ContextProps>({
  user: null,
  setUser: (user: User) => null,
  isAuthenticated: false,
  setIsAuthenticated: () => false,
  isAdminApproved: false,
  setIsAdminApproved: () => false,
  checkAdminApproval: async () => {},
  authorizedEmails: [],
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdminApproved, setIsAdminApproved] = useState<boolean>(false);

  const authorizedEmails: string[] = JSON.parse(process.env.NEXT_PUBLIC_AUTHORIZED_EMAILS || "[]");

  const { data: session, status } = useSession();

  const checkAdminApproval = useCallback(async (email: string) => {
    if (email) {      
      try {
        const response = await fetch("/api/getUserApprovalStatus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        });
        const data = await response.json();

        setIsAdminApproved(data.success && data.message === "Account is goedgekeurd");
      } catch (error) {
        console.error("Failed to fetch admin approval status:", error);
        setIsAdminApproved(false);
      }
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setIsAuthenticated(true);
      setUser(session.user);

      if (session.user.email) {
        checkAdminApproval(session.user.email);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setIsAdminApproved(false);
    }
  }, [session?.user, status, checkAdminApproval]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        isAdminApproved,
        setIsAdminApproved,
        checkAdminApproval,
        authorizedEmails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
