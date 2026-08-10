import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ProductCard from "@/components/ProductCard";
import { Colors } from "@/constants/theme";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistScreen() {
  const {
    wishlist,
    removeFromWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>
            My Wishlist
          </Text>

          <Text style={styles.countText}>
            {wishlist.length}{" "}
            {wishlist.length === 1
              ? "product"
              : "products"}{" "}
            saved
          </Text>
        </View>

        {wishlist.length > 0 && (
          <View style={styles.heartCircle}>
            <Ionicons
              name="heart"
              size={22}
              color="#EF4444"
            />
          </View>
        )}
      </View>

      {/* Wishlist */}
      <FlatList
        data={wishlist}
        keyExtractor={(item) =>
          item.id.toString()
        }
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          wishlist.length === 0
            ? styles.emptyList
            : styles.list
        }
        columnWrapperStyle={
          wishlist.length > 0
            ? styles.columnWrapper
            : undefined
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons
                name="heart-outline"
                size={65}
                color="#EF4444"
              />
            </View>

            <Text style={styles.emptyTitle}>
              Your Wishlist is Empty
            </Text>

            <Text style={styles.emptySubtitle}>
              Save products you love and
              find them here later.
            </Text>

            <Pressable
              style={styles.shopButton}
              onPress={() =>
                router.push("/(tabs)")
              }
            >
              <Ionicons
                name="bag-outline"
                size={20}
                color="#FFFFFF"
              />

              <Text style={styles.shopButtonText}>
                Start Shopping
              </Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() =>
              router.push(
                `/product/${item.id}`
              )
            }
            onAddToCart={() =>
              addToCart(item)
            }
            onWishlist={() =>
              removeFromWishlist(item.id)
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
    paddingHorizontal: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: 6,
    paddingTop: 8,
    paddingBottom: 16,
  },

  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.light.text,
  },

  countText: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  heartCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,

    backgroundColor: "#FEE2E2",

    justifyContent: "center",
    alignItems: "center",
  },

  list: {
    paddingBottom: 30,
  },

  columnWrapper: {
    justifyContent: "space-between",
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 80,
  },

  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,

    backgroundColor: "#FEE2E2",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 25,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  emptySubtitle: {
    marginTop: 10,
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },

  shopButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: Colors.light.primary,

    paddingHorizontal: 24,
    paddingVertical: 14,

    borderRadius: 14,

    marginTop: 25,

    elevation: 3,
  },

  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});