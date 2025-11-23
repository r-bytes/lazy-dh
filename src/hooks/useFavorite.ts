"use client";

import { addFavoriteProduct, getUserIdFromEmail, removeFavoriteProduct } from "@/actions/users/user.actions";
import { checkFavoriteStatus } from "@/lib/db/data";
import { Product } from "@/lib/types/product";
import { debounce } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useCallback, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

interface UseFavoriteReturn {
  isFavorite: boolean;
  isLoading: boolean;
  toggleFavorite: () => Promise<void>;
}

export function useFavorite(product: Product, onRemoveFavorite?: (productId: string) => void): UseFavoriteReturn {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasFetchedFavorite, setHasFetchedFavorite] = useState<boolean>(false);
  const hasFetchedRef = useRef(false);

  const toggleFavoriteHandler = useCallback(async () => {
    if (!session?.user?.email || session.user.email === "undefined") {
      toast.error("Je moet eerst inloggen...");
      return;
    }

    setIsLoading(true);

    try {
      const userId = await getUserIdFromEmail(session.user.email);

      if (!userId) {
        toast.error("Er is iets fout gegaan bij het ophalen van je gebruikers Id...");
        setIsLoading(false);
        return;
      }

      // If we haven't fetched the favorite status yet, fetch it first
      if (!hasFetchedRef.current) {
        try {
          const currentIsFavorite = await checkFavoriteStatus(userId, product._id);
          setIsFavorite(currentIsFavorite);
          hasFetchedRef.current = true;
          setHasFetchedFavorite(true);
          setIsLoading(false);
          // Don't toggle on first click, just show current status
          return;
        } catch (error) {
          console.error("Error fetching favorite status:", error);
          setIsLoading(false);
          return;
        }
      }

      const productId = product._id;
      const newIsFavorite = !isFavorite;
      setIsFavorite(newIsFavorite);

      if (newIsFavorite) {
        // Add to favorites
        const response = await addFavoriteProduct(userId, productId);
        if (!response.success) {
          throw new Error(response.message);
        }
        toast.success(`${product.name} succesvol toegevoegd aan favorieten.`);
      } else {
        // Remove from favorites
        const response = await removeFavoriteProduct(userId, productId);
        if (!response.success) {
          throw new Error(response.message);
        }
        toast.success(`${product.name} succesvol verwijderd uit favorieten.`);
        if (onRemoveFavorite) {
          onRemoveFavorite(productId);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Er is iets misgegaan bij het wijzigen van favorieten.");
      // Revert the state on error
      setIsFavorite((prev) => !prev);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.email, product._id, product.name, isFavorite, onRemoveFavorite]);

  const debouncedToggle = useMemo(() => debounce(toggleFavoriteHandler, 300), [toggleFavoriteHandler]);

  const toggleFavorite = useCallback(async () => {
    debouncedToggle();
  }, [debouncedToggle]);

  return {
    isFavorite,
    isLoading,
    toggleFavorite,
  };
}

