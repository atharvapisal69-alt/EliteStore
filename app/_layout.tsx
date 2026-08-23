import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

function AuthGate() {
  const { user, loading } = useAuth();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const firstSegment = segments[0];

    // =========================
    // PUBLIC ROUTES
    // =========================

    const onLogin = firstSegment === "login";

    // =========================
    // ADMIN ROUTES
    // =========================

    const adminRoutes = [
      "admin",
      "admin-orders",
      "admin-order-details",
      "admin-products",
      "admin-product-form",
      "admin-customers",
      "admin-customer-details",
    ];

    const onAdmin = adminRoutes.includes(
      firstSegment as string
    );

    // =========================
    // NOT LOGGED IN
    // =========================

    if (!user) {
      if (!onLogin) {
        router.replace("/login");
      }

      return;
    }

    // =========================
    // ADMIN USER
    // =========================

    if (user.isAdmin) {
      /*
       * IMPORTANT:
       * If the admin is already inside ANY
       * admin screen, don't redirect them.
       */

      if (!onAdmin) {
        router.replace("/admin");
      }

      return;
    }

    // =========================
    // NORMAL CUSTOMER
    // =========================

    /*
     * Normal customers cannot access
     * admin pages.
     */

    if (onAdmin) {
      router.replace("/(tabs)");
      return;
    }

    // =========================
    // LOGIN -> CUSTOMER APP
    // =========================

    if (onLogin) {
      router.replace("/(tabs)");
    }
  }, [user, loading, segments, router]);

  // Don't render navigation until
  // authentication state is ready.
  if (loading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* =========================
          AUTH
      ========================= */}

      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />

      {/* =========================
          CUSTOMER APP
      ========================= */}

      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      {/* =========================
          ADMIN DASHBOARD
      ========================= */}

      <Stack.Screen
        name="admin"
        options={{
          headerShown: false,
        }}
      />

      {/* =========================
          ADMIN ORDERS
      ========================= */}

      <Stack.Screen
        name="admin-orders"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="admin-order-details"
        options={{
          headerShown: false,
        }}
      />

      {/* =========================
          ADMIN PRODUCTS
      ========================= */}

      <Stack.Screen
        name="admin-products"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="admin-product-form"
        options={{
          headerShown: false,
        }}
      />

      {/* =========================
          ADMIN CUSTOMERS
      ========================= */}

      <Stack.Screen
        name="admin-customers"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="admin-customer-details"
        options={{
          headerShown: false,
        }}
      />

      {/* =========================
          CUSTOMER PRODUCT
      ========================= */}

      <Stack.Screen
        name="product/[id]"
        options={{
          headerShown: false,
        }}
      />

      {/* =========================
          CHECKOUT
      ========================= */}

      <Stack.Screen
        name="checkout"
        options={{
          headerShown: false,
        }}
      />

      {/* =========================
          SUCCESS
      ========================= */}

      <Stack.Screen
        name="success"
        options={{
          headerShown: false,
        }}
      />

      {/* =========================
          ORDERS
      ========================= */}

      <Stack.Screen
        name="orders"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="order-details"
        options={{
          headerShown: false,
        }}
      />

      {/* =========================
          SETTINGS
      ========================= */}

      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider
      value={
        colorScheme === "dark"
          ? DarkTheme
          : DefaultTheme
      }
    >
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AuthGate />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}