import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/config";
import { Product } from "@/types/Product";

const productsCollection = collection(db, "products");

const FAKE_STORE_API =
  "https://fakestoreapi.com/products";

/**
 * Convert Fake Store API product
 * into our Product interface.
 */
function convertFakeStoreProduct(item: any): Product {
  return {
    id: Number(item.id),

    title: item.title || "",

    description: item.description || "",

    category: item.category || "Other",

    brand: item.brand || "",

    price: Number(item.price || 0),

    discountPercentage: Number(
      item.discountPercentage || 0
    ),

    rating: Number(
      item.rating?.rate || item.rating || 0
    ),

    stock: Number(item.stock || 10),

    thumbnail:
      item.thumbnail ||
      item.image ||
      "",

    images:
      item.images?.length > 0
        ? item.images
        : item.image
        ? [item.image]
        : [],
  };
}

/**
 * Convert Firebase product.
 */
function convertFirebaseProduct(
  data: any
): Product {
  return {
    ...data,

    id: Number(data.id),

    price: Number(data.price || 0),

    discountPercentage: Number(
      data.discountPercentage || 0
    ),

    rating: Number(data.rating || 0),

    stock: Number(data.stock || 0),

    thumbnail:
      data.thumbnail ||
      data.image ||
      "",

    images:
      Array.isArray(data.images)
        ? data.images
        : data.thumbnail
        ? [data.thumbnail]
        : [],
  };
}

/**
 * Get ALL customer products.
 *
 * Products come from:
 *
 * 1. Fake Store API
 * 2. Firebase admin-added products
 *
 * Both are combined.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    console.log(
      "🔥 Loading products from Fake Store API..."
    );

    // ------------------------------------------
    // 1. LOAD FAKE STORE PRODUCTS
    // ------------------------------------------

    const response = await fetch(
      FAKE_STORE_API
    );

    if (!response.ok) {
      throw new Error(
        `Fake Store API error: ${response.status}`
      );
    }

    const fakeStoreData =
      await response.json();

    const fakeStoreProducts: Product[] =
      fakeStoreData.map(
        convertFakeStoreProduct
      );

    console.log(
      "🛍️ Fake Store products:",
      fakeStoreProducts.length
    );

    // ------------------------------------------
    // 2. LOAD FIREBASE PRODUCTS
    // ------------------------------------------

    console.log(
      "🔥 Loading admin products from Firebase..."
    );

    const snapshot = await getDocs(
      productsCollection
    );

    const firebaseProducts: Product[] =
      snapshot.docs.map((document) => {
        const data = document.data();

        return convertFirebaseProduct(data);
      });

    console.log(
      "🔥 Firebase products:",
      firebaseProducts.length
    );

    // ------------------------------------------
    // 3. COMBINE PRODUCTS
    // ------------------------------------------

    const combinedProducts = [
      ...fakeStoreProducts,
      ...firebaseProducts,
    ];

    // ------------------------------------------
    // 4. REMOVE DUPLICATES
    // ------------------------------------------

    const uniqueProducts =
      Array.from(
        new Map(
          combinedProducts.map((product) => [
            `${product.id}-${product.title}`,
            product,
          ])
        ).values()
      );

    console.log(
      "================================="
    );

    console.log(
      "🔥 TOTAL CUSTOMER PRODUCTS:",
      uniqueProducts.length
    );

    console.log(
      "🛍️ Fake Store:",
      fakeStoreProducts.length
    );

    console.log(
      "🔥 Firebase:",
      firebaseProducts.length
    );

    console.log(
      "================================="
    );

    return uniqueProducts;
  } catch (error) {
    console.error(
      "❌ Error fetching customer products:",
      error
    );

    throw error;
  }
}

/**
 * Get one product by ID.
 *
 * First checks Firebase.
 * If not found, checks Fake Store API.
 */
export async function getProductById(
  id: string | number
): Promise<Product | null> {
  try {
    const productId = Number(id);

    if (Number.isNaN(productId)) {
      console.error(
        "❌ Invalid product ID:",
        id
      );

      return null;
    }

    // ------------------------------------------
    // 1. CHECK FIREBASE
    // ------------------------------------------

    const productsQuery = query(
      productsCollection,
      where("id", "==", productId)
    );

    const firebaseSnapshot =
      await getDocs(productsQuery);

    if (!firebaseSnapshot.empty) {
      const data =
        firebaseSnapshot.docs[0].data();

      console.log(
        "🔥 Product found in Firebase:",
        productId
      );

      return convertFirebaseProduct(data);
    }

    // ------------------------------------------
    // 2. CHECK FAKE STORE API
    // ------------------------------------------

    console.log(
      "🌐 Product not in Firebase. Checking Fake Store API:",
      productId
    );

    const response = await fetch(
      `${FAKE_STORE_API}/${productId}`
    );

    if (!response.ok) {
      console.log(
        "⚠️ Product not found:",
        productId
      );

      return null;
    }

    const data =
      await response.json();

    if (!data?.id) {
      return null;
    }

    return convertFakeStoreProduct(data);
  } catch (error) {
    console.error(
      "❌ Error fetching product:",
      error
    );

    return null;
  }
}

/**
 * Get products by category.
 *
 * Searches the combined product list,
 * so related products work for BOTH
 * Firebase and Fake Store products.
 */
export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  try {
    const products =
      await getProducts();

    return products.filter(
      (product) =>
        product.category === category
    );
  } catch (error) {
    console.error(
      "❌ Error fetching category products:",
      error
    );

    return [];
  }
}