"use client";

import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

type ContextProps = {
  user: User | null;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  isAdminApproved: boolean;
  setIsAdminApproved: Dispatch<SetStateAction<boolean>>;
  checkAdminApproval: (email: string) => Promise<void>;
};

export const AuthContext = createContext<ContextProps>({
  user: null,
  setUser: (user: User) => null,
  isAuthenticated: false,
  setIsAuthenticated: () => false,
  isAdminApproved: false,
  setIsAdminApproved: () => false,
  checkAdminApproval: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdminApproved, setIsAdminApproved] = useState<boolean>(false);

  const { data: session, status } = useSession();

  const checkAdminApproval = async (email: string) => {
    if (email) {      
      try {
        const response = await fetch("/api/getUserApprovalStatus", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        });
        const data = await response.json();

        if (data.success && data.message === "Account is goedgekeurd") {          
          setIsAdminApproved(true);
        } else {
          setIsAdminApproved(false);
        }
      } catch (error) {
        
        console.error("Failed to fetch admin approval status:", error);
        setIsAdminApproved(false);
      }
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setIsAuthenticated(true);
      setUser(session.user);

      session.user.email && checkAdminApproval(session.user.email);

    } else {
      setIsAuthenticated(false);
      setUser(null);
      setIsAdminApproved(false);
    }
  }, [session, status]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        isAdminApproved,
        setIsAdminApproved,
        checkAdminApproval
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
