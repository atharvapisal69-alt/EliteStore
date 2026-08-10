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
  isInWishlist: (id: number) => boolean;
};

const WishlistContext =
  createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load wishlist
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const savedWishlist =
          await AsyncStorage.getItem("wishlist");

        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        }
      } catch (error) {
        console.log("Error loading wishlist:", error);
      } finally {
        setLoaded(true);
      }
    };

    loadWishlist();
  }, []);

  // Save wishlist
  useEffect(() => {
    if (!loaded) return;

    const saveWishlist = async () => {
      try {
        await AsyncStorage.setItem(
          "wishlist",
          JSON.stringify(wishlist)
        );
      } catch (error) {
        console.log("Error saving wishlist:", error);
      }
    };

    saveWishlist();
  }, [wishlist, loaded]);

  // Add
  const addToWishlist = (product: Product) => {
    setWishlist((currentWishlist) => {
      const exists = currentWishlist.some(
        (item) => item.id === product.id
      );

      if (exists) {
        return currentWishlist;
      }

      return [...currentWishlist, product];
    });
  };

  // Remove
  const removeFromWishlist = (id: number) => {
    setWishlist((currentWishlist) =>
      currentWishlist.filter((item) => item.id !== id)
    );
  };

  // Toggle
  const toggleWishlist = (product: Product) => {
    setWishlist((currentWishlist) => {
      const exists = currentWishlist.some(
        (item) => item.id === product.id
      );

      if (exists) {
        return currentWishlist.filter(
          (item) => item.id !== product.id
        );
      }

      return [...currentWishlist, product];
    });
  };

  // Check
  const isInWishlist = (id: number) => {
    return wishlist.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used within WishlistProvider"
    );
  }

  return context;
};