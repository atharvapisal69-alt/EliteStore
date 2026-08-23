import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
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
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  // ADD ALL
  const handleAddAll = () => {
    if (wishlist.length === 0) return;

    wishlist.forEach((item) => {
      addToCart(item);
    });

    Alert.alert(
      "Added to Cart",
      `${wishlist.length} ${
        wishlist.length === 1
          ? "product"
          : "products"
      } added to your cart.`
    );
  };

  // REMOVE ALL
  const handleRemoveAll = () => {
    if (wishlist.length === 0) return;

    Alert.alert(
      "Remove All",
      "Are you sure you want to remove all wishlist items?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove All",
          style: "destructive",
          onPress: async () => {
            await clearWishlist();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={wishlist}
        keyExtractor={(item) =>
          item.id.toString()
        }
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={
          wishlist.length > 0
            ? styles.columnWrapper
            : undefined
        }
        contentContainerStyle={
          wishlist.length === 0
            ? styles.emptyList
            : styles.list
        }
        ListHeaderComponent={
          <>
            {/* HEADER */}
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

              <View style={styles.heartCircle}>
                <Ionicons
                  name="heart"
                  size={22}
                  color="#EF4444"
                />
              </View>
            </View>

            {/* ACTION BUTTONS */}
            {wishlist.length > 0 && (
              <View style={styles.actionRow}>
                <Pressable
                  style={styles.addAllButton}
                  onPress={handleAddAll}
                >
                  <Ionicons
                    name="cart-outline"
                    size={19}
                    color="#FFFFFF"
                  />

                  <Text style={styles.addAllText}>
                    Add All
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.removeAllButton}
                  onPress={handleRemoveAll}
                >
                  <Ionicons
                    name="trash-outline"
                    size={19}
                    color="#EF4444"
                  />

                  <Text style={styles.removeAllText}>
                    Remove All
                  </Text>
                </Pressable>
              </View>
            )}
          </>
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
              Save products you love and find
              them here later.
            </Text>

            <Pressable
              style={styles.shopButton}
              onPress={() =>
                router.replace("/(tabs)")
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
              router.push({
                pathname: "/product/[id]",
                params: {
                  id: item.id.toString(),
                },
              })
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

  list: {
    paddingBottom: 30,
  },

  columnWrapper: {
    justifyContent: "space-between",
  },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingTop: 8,
    paddingBottom: 14,
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

  // ACTION BUTTONS
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 6,
    marginBottom: 12,
  },

  addAllButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primary,
    paddingVertical: 13,
    borderRadius: 12,
    marginRight: 8,
  },

  addAllText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 7,
  },

  removeAllButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
    paddingVertical: 13,
    borderRadius: 12,
  },

  removeAllText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 6,
  },

  // EMPTY
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 70,
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