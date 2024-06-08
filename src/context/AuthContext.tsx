"use client";

import { validateRequest } from "@/lib/db/auth";
import { User } from "lucia";
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

  useEffect(() => {
    (async () => {
      const { user } = await validateRequest();
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      }
    })();
  }, []);

  // const isAuthenticated = (): boolean => {
  //   return !!user; // Returns true if user is not null
  // };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
