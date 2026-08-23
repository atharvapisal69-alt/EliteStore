import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/firebase/config";
import { Product } from "@/types/Product";

const productsCollection = collection(db, "products");

export type FirebaseProduct = Product & {
  firebaseId: string;
};

// =========================
// GET ALL PRODUCTS
// =========================

export async function getAllProducts(): Promise<FirebaseProduct[]> {
  try {
    const snapshot = await getDocs(productsCollection);

    return snapshot.docs.map((document) => {
      const data = document.data() as Product;

      return {
        ...data,
        firebaseId: document.id,
      };
    });
  } catch (error) {
    console.error("❌ Error loading Firebase products:", error);
    throw error;
  }
}

// =========================
// ADD PRODUCT
// =========================

export async function addProduct(
  product: Omit<Product, "id">
): Promise<string> {
  try {
    const snapshot = await getDocs(productsCollection);

    let nextId = 1;

    if (snapshot.docs.length > 0) {
      const ids = snapshot.docs.map((item) =>
        Number(item.data().id ?? 0)
      );

      const validIds = ids.filter((id) => !isNaN(id));

      if (validIds.length > 0) {
        nextId = Math.max(...validIds) + 1;
      }
    }

    const productData: Product = {
      ...product,
      id: nextId,
    };

    const document = await addDoc(
      productsCollection,
      productData
    );

    console.log("✅ Product added to Firebase:", {
      firebaseId: document.id,
      product: productData,
    });

    return document.id;
  } catch (error) {
    console.error("❌ Error adding product:", error);
    throw error;
  }
}

// =========================
// UPDATE PRODUCT
// =========================

export async function updateProduct(
  firebaseId: string,
  product: Partial<Product>
): Promise<void> {
  try {
    const productRef = doc(
      db,
      "products",
      firebaseId
    );

    await updateDoc(productRef, product);

    console.log(
      "✅ Product updated:",
      firebaseId
    );
  } catch (error) {
    console.error(
      "❌ Error updating product:",
      error
    );

    throw error;
  }
}

// =========================
// DELETE PRODUCT
// =========================

export async function deleteProduct(
  firebaseId: string
): Promise<void> {
  try {
    const productRef = doc(
      db,
      "products",
      firebaseId
    );

    await deleteDoc(productRef);

    console.log(
      "✅ Product deleted:",
      firebaseId
    );
  } catch (error) {
    console.error(
      "❌ Error deleting product:",
      error
    );

    throw error;
  }
}