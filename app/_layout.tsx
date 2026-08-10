import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";

import { useColorScheme } from "@/hooks/use-color-scheme";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

function AuthGate() {
  const { user, loading } = useAuth();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const firstSegment = segments[0];

    const onLoginScreen =
      firstSegment === "login";

    if (!user && !onLoginScreen) {
      router.replace("/login");
    }

    if (user && onLoginScreen) {
      router.replace("/(tabs)");
    }
  }, [user, loading, segments, router]);

  if (loading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="product/[id]"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="checkout"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="success"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="orders"
        options={{
          headerShown: false,
        }}
      />

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