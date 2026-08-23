import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { Product } from "@/types/Product";

type WishlistContextType = {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => Promise<void>;
  isInWishlist: (id: number) => boolean;
};

const WishlistContext =
  createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  // LOAD
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const saved = await AsyncStorage.getItem("wishlist");

        if (saved) {
          setWishlist(JSON.parse(saved));
        }
      } catch (error) {
        console.log("Wishlist load error:", error);
      } finally {
        setLoaded(true);
      }
    };

    loadWishlist();
  }, []);

  // SAVE
  useEffect(() => {
    if (!loaded) return;

    AsyncStorage.setItem(
      "wishlist",
      JSON.stringify(wishlist)
    ).catch((error) => {
      console.log("Wishlist save error:", error);
    });
  }, [wishlist, loaded]);

  // ADD
  const addToWishlist = (product: Product) => {
    setWishlist((current) => {
      if (
        current.some(
          (item) => item.id === product.id
        )
      ) {
        return current;
      }

      return [...current, product];
    });
  };

  // REMOVE ONE
  const removeFromWishlist = (id: number) => {
    setWishlist((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  // TOGGLE
  const toggleWishlist = (product: Product) => {
    setWishlist((current) => {
      const exists = current.some(
        (item) => item.id === product.id
      );

      if (exists) {
        return current.filter(
          (item) => item.id !== product.id
        );
      }

      return [...current, product];
    });
  };

  // REMOVE ALL
  const clearWishlist = async () => {
    setWishlist([]);

    try {
      await AsyncStorage.removeItem("wishlist");
    } catch (error) {
      console.log("Clear wishlist error:", error);
    }
  };

  // CHECK
  const isInWishlist = (id: number) => {
    return wishlist.some(
      (item) => item.id === id
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}