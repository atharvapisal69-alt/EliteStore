import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/firebase/config";
import { Product } from "@/types/Product";

const wishlistCollection = "wishlists";

// =========================
// GET WISHLIST
// =========================
export async function getWishlist(
  userId: string
): Promise<Product[]> {
  const wishlistRef = doc(
    db,
    wishlistCollection,
    userId
  );

  const snapshot = await getDoc(wishlistRef);

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.data();

  return (data.products || []) as Product[];
}

// =========================
// SAVE WISHLIST
// =========================
export async function saveWishlist(
  userId: string,
  products: Product[]
): Promise<void> {
  const wishlistRef = doc(
    db,
    wishlistCollection,
    userId
  );

  await setDoc(
    wishlistRef,
    {
      userId,
      products,
      updatedAt: new Date().toISOString(),
    },
    {
      merge: true,
    }
  );
}