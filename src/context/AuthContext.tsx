"use client";

import { validateRequest } from "@/lib/db/auth";
import { User } from "lucia";
import React, { createContext, useContext, useEffect, useState } from "react";

type ContextProps = {
  user: User | null;
  setUser: (user: User) => void;
  isAuthenticated: () => boolean;
};

export const AuthContext = createContext<ContextProps>({
  user: null,
  setUser: (user: User) => null,
  isAuthenticated: () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const { user } = await validateRequest();
      if (user) {
        setUser(user);
      }
    })();
  }, []);

  const isAuthenticated = (): boolean => {
    return !!user; // Returns true if user is not null
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
