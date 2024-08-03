import { db } from "@/lib/db";
import { favoriteProducts } from "@/lib/db/schema";
// Functie om een favoriet product toe te voegen
// export const addFavoriteProduct = async (userId: string, productId: string) => {
//   try {
//     await db.favoriteProducts.insert({
//       userId,
//       productId,
//     });
//     return { success: true, message: "Product succesvol toegevoegd aan favorieten" };
//   } catch (error) {
//     console.error("Error adding favorite product:", error);
//     return { success: false, message: "Er is iets misgegaan" };
//   }
// };

// // Functie om een favoriet product te verwijderen
// export const removeFavoriteProduct = async (userId: string, productId: string) => {
//   try {
//     await db.favoriteProducts.delete().where({
//       userId,
//       productId,
//     });
//     return { success: true, message: "Product succesvol verwijderd uit favorieten" };
//   } catch (error) {
//     console.error("Error removing favorite product:", error);
//     return { success: false, message: "Er is iets misgegaan" };
//   }
// };
