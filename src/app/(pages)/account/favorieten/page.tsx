"use client";

import { getUserIdFromEmail } from "@/actions/users/user.actions";
import Favorites from "@/components/products/product-list-favorite";
import { getFavoriteProductIds } from "@/lib/db/data";
import { fetchProducts } from "@/lib/sanity/fetchProducts";
import { Product } from "@/lib/types/product";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Page() {
  const { data: session } = useSession();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      try {
        const userId = await getUserIdFromEmail(session.user.email!);
        const favoriteProductIds = await getFavoriteProductIds(userId!);
        const allProducts = await fetchProducts();
        
        const favoriteProductIdsSet = new Set(favoriteProductIds);
        const favorites = allProducts.filter((product) => favoriteProductIdsSet.has(product._id));
        
        if (JSON.stringify(favorites) !== JSON.stringify(favoriteProducts)) {
          setFavoriteProducts(favorites);
        }
      } catch (error) {
        console.error("Error fetching favorite products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  return <Favorites favoriteProducts={favoriteProducts} loading={loading} />;
}
