"use client";

import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

type ContextProps = {
  user: User | null;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
};

export const AuthContext = createContext<ContextProps>({
  user: null,
  setUser: (user: User) => null,
  isAuthenticated: false,
  setIsAuthenticated: () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {     
      setIsAuthenticated(true);
      setUser(session?.user!);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [session, status]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
