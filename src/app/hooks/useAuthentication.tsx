"use client";

import { validateRequest } from "@/lib/db/auth";
import { User } from "lucia";
import React, { useEffect, useState } from "react";

export const useAuthentication = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      const { user } = await validateRequest();
      if (user) {
        setUser(user);
      }
    };

    initializeUser();
  }, []);

  const isAuthenticated = (): boolean => {
    return !!user; // Returns true if user is not null
  };

  return { user, setUser, isAuthenticated };
};
