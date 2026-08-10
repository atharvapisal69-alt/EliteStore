import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

import { useCart } from "@/context/CartContext";

export default function TabLayout() {
  const { cart } = useCart();

  // Total quantity of all products
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#777777",

        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 5,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 10,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* CART */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="cart-outline"
              size={size}
              color={color}
            />
          ),

          // Cart Badge
          tabBarBadge:
            cartCount > 0
              ? cartCount > 99
                ? "99+"
                : cartCount
              : undefined,

          tabBarBadgeStyle: {
            backgroundColor: "#EF4444",
            color: "#FFFFFF",
            fontSize: 10,
            fontWeight: "700",
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            textAlign: "center",
            lineHeight: 18,
          },
        }}
      />

      {/* WISHLIST */}
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="heart-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}