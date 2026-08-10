import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

type CartItem = {
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

type Order = {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: string;
};

type CartContextType = {
  cart: CartItem[];
  orders: Order[];

  addToCart: (item: ProductInput) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  removeItem: (id: number) => void;

  placeOrder: () => Promise<string>;
  clearCart: () => Promise<void>;

  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load orders
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await AsyncStorage.getItem("orders");

        if (data) {
          setOrders(JSON.parse(data));
        }
      } catch (error) {
        console.log("Error loading orders:", error);
      }
    };

    loadOrders();
  }, []);

  // Load cart when app starts
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem("cart");

        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } catch (error) {
        console.log("Error loading cart:", error);
      } finally {
        setLoaded(true);
      }
    };

    loadCart();
  }, []);

  // Save cart after it has loaded
  useEffect(() => {
    if (!loaded) return;

    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(
          "cart",
          JSON.stringify(cart)
        );
      } catch (error) {
        console.log("Error saving cart:", error);
      }
    };

    saveCart();
  }, [cart, loaded]);

  // Add product to cart
  const addToCart = (product: ProductInput) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity: 1,
        },
      ];
    });
  };

  // Increase quantity
  const increaseQty = (id: number) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQty = (id: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove item
  const removeItem = (id: number) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  };

  // Clear cart
  const clearCart = async (): Promise<void> => {
    setCart([]);

    try {
      await AsyncStorage.removeItem("cart");
    } catch (error) {
      console.log("Error clearing cart:", error);
    }
  };

  // Calculate total price
  const totalPrice = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  // Place order
  const placeOrder = async (): Promise<string> => {
    const orderId =
      "#" +
      Math.floor(
        100000 + Math.random() * 900000
      );

    const deliveryCharge =
      cart.length > 0 ? 99 : 0;

    const newOrder: Order = {
      id: orderId,
      items: cart,
      total: totalPrice + deliveryCharge,
      date: new Date().toLocaleDateString(),
      status: "Placed",
    };

    const updatedOrders = [
      newOrder,
      ...orders,
    ];

    setOrders(updatedOrders);

    await AsyncStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );

    await clearCart();

    return orderId;
  };

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
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}