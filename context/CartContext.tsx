// context/CartContext.tsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "@/context/AuthContext";

import {
  createOrder,
  getUserOrders,
  updateOrder,
  type Order,
  type OrderItem,
  type OrderStatus,
} from "@/services/orderService";

// ======================================================
// CART TYPES
// ======================================================

export type CartItem = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
};

type ProductInput = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

// ======================================================
// CONTEXT TYPE
// ======================================================

type CartContextType = {
  cart: CartItem[];

  orders: Order[];

  addToCart: (
    item: ProductInput
  ) => void;

  increaseQty: (
    id: number
  ) => void;

  decreaseQty: (
    id: number
  ) => void;

  removeItem: (
    id: number
  ) => void;

  placeOrder: () => Promise<string>;

  clearCart: () => Promise<void>;

  updateOrderStatus: (
    orderId: string,
    status: OrderStatus
  ) => Promise<void>;

  totalPrice: number;
};

// ======================================================
// CREATE CONTEXT
// ======================================================

const CartContext =
  createContext<CartContextType | undefined>(
    undefined
  );

// ======================================================
// CART PROVIDER
// ======================================================

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  // ====================================================
  // STATE
  // ====================================================

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loaded, setLoaded] =
    useState(false);

  // ====================================================
  // LOAD CART FROM ASYNC STORAGE
  // ====================================================

  useEffect(() => {
    const loadCart = async () => {
      try {
        console.log(
          "🛒 Loading cart..."
        );

        const savedCart =
          await AsyncStorage.getItem(
            "cart"
          );

        if (savedCart) {
          const parsedCart =
            JSON.parse(savedCart);

          if (Array.isArray(parsedCart)) {
            setCart(parsedCart);
          }
        }

        console.log(
          "🛒 Cart loaded successfully"
        );
      } catch (error) {
        console.error(
          "❌ Error loading cart:",
          error
        );
      } finally {
        setLoaded(true);
      }
    };

    loadCart();
  }, []);

  // ====================================================
  // SAVE CART TO ASYNC STORAGE
  // ====================================================

  useEffect(() => {
    if (!loaded) return;

    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(
          "cart",
          JSON.stringify(cart)
        );

        console.log(
          "💾 Cart saved:",
          cart.length,
          "items"
        );
      } catch (error) {
        console.error(
          "❌ Error saving cart:",
          error
        );
      }
    };

    saveCart();
  }, [cart, loaded]);

  // ====================================================
  // LOAD USER ORDERS FROM FIREBASE
  // ====================================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      console.log(
        "⚠️ No logged-in user. Clearing orders."
      );

      setOrders([]);

      return;
    }

    if (!user.uid) {
      console.log(
        "⚠️ Logged-in user has no UID."
      );

      setOrders([]);

      return;
    }

    const loadOrders = async () => {
      try {
        console.log(
          "================================="
        );

        console.log(
          "🔥 Loading user orders..."
        );

        console.log(
          "User ID:",
          user.uid
        );

        const userOrders =
          await getUserOrders(
            user.uid
          );

        setOrders(userOrders);

        console.log(
          "🔥 Orders loaded:",
          userOrders.length
        );

        console.log(
          "================================="
        );
      } catch (error) {
        console.error(
          "❌ Error loading Firebase orders:",
          error
        );

        setOrders([]);
      }
    };

    loadOrders();
  }, [user, authLoading]);

  // ====================================================
  // ADD TO CART
  // ====================================================

  const addToCart = (
    product: ProductInput
  ) => {
    setCart((currentCart) => {
      const existingItem =
        currentCart.find(
          (item) =>
            item.id === product.id
        );

      // -----------------------------------------------
      // PRODUCT ALREADY EXISTS
      // -----------------------------------------------

      if (existingItem) {
        console.log(
          "🛒 Increasing product quantity:",
          product.title
        );

        return currentCart.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
        );
      }

      // -----------------------------------------------
      // NEW PRODUCT
      // -----------------------------------------------

      console.log(
        "🛒 Adding new product:",
        product.title
      );

      return [
        ...currentCart,
        {
          id: product.id,
          title: product.title,
          price:
            Number(product.price) || 0,
          thumbnail:
            product.thumbnail || "",
          quantity: 1,
        },
      ];
    });
  };

  // ====================================================
  // INCREASE QUANTITY
  // ====================================================

  const increaseQty = (
    id: number
  ) => {
    setCart((currentCart) =>
      currentCart.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
      )
    );
  };

  // ====================================================
  // DECREASE QUANTITY
  // ====================================================

  const decreaseQty = (
    id: number
  ) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };

  // ====================================================
  // REMOVE ITEM
  // ====================================================

  const removeItem = (
    id: number
  ) => {
    console.log(
      "🗑️ Removing cart item:",
      id
    );

    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  // ====================================================
  // CLEAR CART
  // ====================================================

  const clearCart =
    async (): Promise<void> => {
      try {
        console.log(
          "🧹 Clearing cart..."
        );

        setCart([]);

        await AsyncStorage.removeItem(
          "cart"
        );

        console.log(
          "✅ Cart cleared successfully"
        );
      } catch (error) {
        console.error(
          "❌ Error clearing cart:",
          error
        );

        // Still clear React state
        setCart([]);
      }
    };

  // ====================================================
  // TOTAL PRICE
  // ====================================================

  const totalPrice =
    cart.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );

  // ====================================================
  // PLACE ORDER
  // ====================================================

  const placeOrder =
    async (): Promise<string> => {
      // -----------------------------------------------
      // AUTH CHECK
      // -----------------------------------------------

      if (!user) {
        throw new Error(
          "You must be logged in to place an order."
        );
      }

      if (!user.uid) {
        throw new Error(
          "User ID is missing."
        );
      }

      // -----------------------------------------------
      // CART CHECK
      // -----------------------------------------------

      if (cart.length === 0) {
        throw new Error(
          "Your cart is empty."
        );
      }

      // -----------------------------------------------
      // DELIVERY
      // -----------------------------------------------

      const deliveryCharge =
        totalPrice > 1000
          ? 0
          : 99;

      // -----------------------------------------------
      // FINAL TOTAL
      // -----------------------------------------------

      const finalTotal =
        totalPrice +
        deliveryCharge;

      try {
        console.log(
          "================================="
        );

        console.log(
          "🔥 CREATING CUSTOMER ORDER"
        );

        console.log(
          "User ID:",
          user.uid
        );

        console.log(
          "User Name:",
          user.name ||
            "Customer"
        );

        console.log(
          "User Email:",
          user.email ||
            "No email"
        );

        console.log(
          "Cart Items:",
          cart.length
        );

        console.log(
          "Subtotal:",
          totalPrice
        );

        console.log(
          "Delivery:",
          deliveryCharge
        );

        console.log(
          "Final Total:",
          finalTotal
        );

        console.log(
          "================================="
        );

        // ---------------------------------------------
        // CONVERT CART ITEMS TO ORDER ITEMS
        // ---------------------------------------------

        const orderItems: OrderItem[] =
          cart.map((item) => ({
            id: item.id,

            title: item.title,

            price:
              Number(item.price) || 0,

            quantity:
              Number(item.quantity) || 1,

            thumbnail:
              item.thumbnail || "",
          }));

        console.log(
          "📦 Order items:",
          orderItems
        );

        // ---------------------------------------------
        // CREATE FIREBASE ORDER
        // ---------------------------------------------

        const orderId =
          await createOrder(
            user.uid,

            user.name ||
              "Customer",

            user.email ||
              "No email",

            orderItems,

            finalTotal
          );

        console.log(
          "================================="
        );

        console.log(
          "✅ ORDER CREATED SUCCESSFULLY"
        );

        console.log(
          "Order ID:",
          orderId
        );

        console.log(
          "================================="
        );

        // ---------------------------------------------
        // RELOAD USER ORDERS
        // ---------------------------------------------

        try {
          const updatedOrders =
            await getUserOrders(
              user.uid
            );

          setOrders(
            updatedOrders
          );

          console.log(
            "🔥 Orders refreshed:",
            updatedOrders.length
          );
        } catch (orderLoadError) {
          console.error(
            "⚠️ Order created but failed to reload orders:",
            orderLoadError
          );
        }

        // ---------------------------------------------
        // CLEAR CART
        // ---------------------------------------------

        await clearCart();

        return orderId;
      } catch (error) {
        console.error(
          "================================="
        );

        console.error(
          "❌ ERROR PLACING ORDER"
        );

        console.error(
          error
        );

        console.error(
          "================================="
        );

        throw error;
      }
    };

  // ====================================================
  // UPDATE ORDER STATUS
  // ====================================================

  const updateOrderStatus =
    async (
      orderId: string,
      status: OrderStatus
    ): Promise<void> => {
      try {
        if (!orderId) {
          throw new Error(
            "Order ID is missing."
          );
        }

        if (!status) {
          throw new Error(
            "Order status is missing."
          );
        }

        console.log(
          "================================="
        );

        console.log(
          "🔄 Updating order status"
        );

        console.log(
          "Order ID:",
          orderId
        );

        console.log(
          "New Status:",
          status
        );

        console.log(
          "================================="
        );

        // ---------------------------------------------
        // UPDATE FIREBASE
        // ---------------------------------------------

        await updateOrder(
          orderId,
          status
        );

        // ---------------------------------------------
        // UPDATE LOCAL STATE
        // ---------------------------------------------

        setOrders(
          (currentOrders) =>
            currentOrders.map(
              (order) =>
                order.id === orderId
                  ? {
                      ...order,
                      status,
                    }
                  : order
            )
        );

        console.log(
          "✅ Order status updated successfully"
        );
      } catch (error) {
        console.error(
          "❌ Error updating order status:",
          error
        );

        throw error;
      }
    };

  // ====================================================
  // PROVIDER
  // ====================================================

  return (
    <CartContext.Provider
      value={{
        cart,

        orders,

        addToCart,

        increaseQty,

        decreaseQty,

        removeItem,

        placeOrder,

        clearCart,

        updateOrderStatus,

        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ======================================================
// CUSTOM HOOK
// ======================================================

export function useCart() {
  const context =
    useContext(
      CartContext
    );

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}